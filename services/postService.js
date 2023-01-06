const postRepository = require("../repositories/postRepository");

const getAllPostsWithComments = async () => {
  return await postRepository.getAllPostsWithComments();
};

const createPost = async (creator, content) => {
  return await postRepository.createPost(creator, content);
};

const deletePost = async (postId) => {
  return await postRepository.deletePost(postId);
};

const updatePost = async (postId, content) => {
  return await postRepository.updatePost(postId, content);
};

module.exports = {
  getAllPostsWithComments,
  createPost,
  deletePost,
  updatePost,
};
