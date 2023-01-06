const commentRepository = require("../repositories/commentRepository");

const createComment = async (creator, postId, content) => {
  return await commentRepository.createComment(creator, postId, content);
};

const deleteComment = async (commentId) => {
  return await commentRepository.deleteComment(commentId);
};

const updateComment = async (commentId, content) => {
  return await commentRepository.updateComment(commentId, content);
};

module.exports = {
  createComment,
  deleteComment,
  updateComment,
};
