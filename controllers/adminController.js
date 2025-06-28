const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users && users.length <= 0){
      throw new Error("No user found!")
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["admin", "author", "reader"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Role updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};
