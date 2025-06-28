const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const authRoute = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentsRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/posts", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api", statsRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = connectDB;
