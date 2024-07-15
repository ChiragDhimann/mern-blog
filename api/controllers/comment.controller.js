import { errorhandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { userId, postId, content } = req.body;
    if (userId !== req.user.id) {
      return next(errorhandler(403, "you are not allowed to create a comment"));
    }

    const newComment = new Comment({
      content,
      userId,
      postId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
