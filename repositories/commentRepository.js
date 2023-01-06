const { Client } = require("pg");
const config = require("../db-config");

const client = new Client(config);
client.connect();

const createComment = async (creator, postId, content) => {
  const publishDate = new Date();
  const lastUpdate = new Date();

  const res = await client.query(
    "INSERT INTO comment (post_id, creator, content, publish_date, last_update) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [postId, creator, content, publishDate, lastUpdate]
  );

  return res.rows[0];
};

const deleteComment = async (commentId) => {
  const lastUpdate = new Date();

  const res = await client.query(
    "UPDATE comment SET is_deleted = true, last_update = $1 WHERE id = $2 RETURNING *",
    [lastUpdate, commentId]
  );

  return res.rows[0];
};

const updateComment = async (commentId, content) => {
  const lastUpdate = new Date();

  const res = await client.query(
    "UPDATE comment SET content = $1, last_update = $2 WHERE id = $3 RETURNING *",
    [content, lastUpdate, commentId]
  );

  return res.rows[0];
};

module.exports = {
  createComment,
  deleteComment,
  updateComment,
};
