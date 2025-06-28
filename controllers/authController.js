const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

const { jwtSecret, jwtExpire, jwtRefresh } = require("../config/auth");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const payload = { userId: user._id, role: user.role };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire });

    const refresh = jwt.sign(payload, jwtRefresh, { expiresIn: "30d" });
    user.refreshToken = {
      token: refresh,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isValid: true,
    };

    await user.save();

    res.status(200).json({ token, refresh });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  console.log(">>>>>>>>", refreshToken);

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token missing" });

  try {
    const user = await User.findOne({ "refreshToken.token": refreshToken });
    if (!user || !user.refreshToken.isValid)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, jwtRefresh, (err, decoded) => {
      if (err || decoded.userId !== user._id.toString()) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const newAccessToken = jwt.sign(
        { userId: user._id, role: user.role },
        jwtSecret,
        { expiresIn: jwtExpire }
      );

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const user = await User.findOne({ "refreshToken.token": refreshToken });
    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid token or already logged out" });

    user.refreshToken.isValid = false;
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your Password Reset OTP",
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiresAt)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const isOtpValid = await otp == user.otp;
    if (!isOtpValid || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP is invalid or expired" });
    }

    
    user.password = newPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { register, login, refreshToken, logout, forgotPassword, resetPassword };
