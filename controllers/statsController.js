const User = require("../models/User");
const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");

const getStats = async (req, res) => {
  try {
    // User model stats
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalAuthors = await User.countDocuments({ role: "author" });
    const totalReaders = await User.countDocuments({ role: "reader" });

    //BlogPost model stats
    const totalPosts = await BlogPost.countDocuments();
    const likedPostsByUser = await BlogPost.aggregate([
      {
        $project: {
             _id: 0,
          likeCount: { $size: "$likes" },
        },
      },
    ]);

    //Comment model stats

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalAuthors,
      totalReaders,
      totalPosts,
      likedPostsByUser,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

module.exports = { getStats };
