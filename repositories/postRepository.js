const { Client } = require("pg");
const config = require("../db-config");

const client = new Client(config);
client.connect();

const getAllPostsWithComments = async () => {
  const res = await client.query(
    `SELECT p.id as id, p.creator as creator, p.content as content, p.publish_date as publishDate, p.last_update as lastUpdate, COALESCE((
            SELECT json_agg(json_build_object(
              'id', c.id,
              'creator', c.creator,
              'content', c.content,
              'publish_date', c.publish_date,
              'last_update', c.last_update
            ))
            FROM comment c
            WHERE c.post_id = p.id AND c.is_deleted = false
          ), '[]'::json) as comments
        FROM post p
        WHERE p.is_deleted = false
        ORDER BY p.publish_date DESC
        `
  );

  // GROUP BY c.id, c.creator, c.content, c.publish_date, c.last_update
  // ORDER BY c.publish_date DESC

  return res.rows;
};

const createPost = async (creator, content) => {
  const publishDate = new Date();
  const lastUpdate = new Date();

  const res = await client.query(
    "INSERT INTO post (creator, content, publish_date, last_update) VALUES ($1, $2, $3, $4) RETURNING *",
    [creator, content, publishDate, lastUpdate]
  );

  return res.rows[0];
};

// set all commnets with is_deleted = true
const deletePost = async (postId) => {
  const lastUpdate = new Date();

  const res = await client.query(
    "UPDATE post SET is_deleted = true, last_update = $1 WHERE id = $2 RETURNING *",
    [lastUpdate, postId]
  );

  return res.rows[0];
};

const updatePost = async (postId, content) => {
  const lastUpdate = new Date();

  const res = await client.query(
    "UPDATE post SET content = $1, last_update = $2 WHERE id = $3 RETURNING *",
    [content, lastUpdate, postId]
  );

  return res.rows[0];
};

module.exports = {
  getAllPostsWithComments,
  createPost,
  deletePost,
  updatePost,
};
