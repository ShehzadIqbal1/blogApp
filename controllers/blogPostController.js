const BlogPost = require("../models/BlogPost");

const getAllPost = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    let skip = (page - 1) * limit;

    const data = await BlogPost.find().limit(limit).skip(skip);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json("Shit");
  }
};

const getPostById = async (req, res) => {
 
  // Test code by TL
  //  const likeId = req.params.id;
  // try{
  //   const post = await BlogPost.find({likes:likeId});
  //   if(!post) return res.status(404).json({ message: "user not found" });
  //   res.json(post)
  // }catch{
  //   res.status(400).json({ message: "Invalid ID" });
  // }

  try {
    const post = await BlogPost.findById(req.params.id).populate(
      "author",
      "name email"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, coverImage } = req.body;
    const post = new BlogPost({
      title,
      content,
      coverImage,
      author: req.user.userId,
    });
    await post.save();
    res.status(201).json(post);
  } catch {
    res.status(500).json({ message: "Failed to create post" });
  }
};

const updatePost = async (req, res) => {
  const { title, content, coverImage } = req.body;

  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this post" });
    }

    post.title = title;
    post.content = content;
    post.coverImage = coverImage;
    post.updatedAt = Date.now();

    await post.save();
    res.json(post);
  } catch {
    res.status(500).json({ message: "Failed to update post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      req.user.role !== "admin" &&
      post.author.toString() !== req.user.userId
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

const likestatusPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await BlogPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }

    res.status(201).json({ message: "Liked post" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to like post" });
  }
};

module.exports = {
  getAllPost,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likestatusPost,
};
