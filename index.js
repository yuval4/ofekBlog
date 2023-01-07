const express = require("express");
const {
  getAllPostsWithComments,
  createPost,
  deletePost,
  updatePost,
} = require("./services/postService");
const {
  createComment,
  deleteComment,
  updateComment,
} = require("./services/commentService");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "css")));
app.use(express.static(path.join(__dirname, "public", "js")));

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "public", "index.html"));
});

// posts

app.get("/api/posts/comments", async (request, response) => {
  try {
    response.send(await getAllPostsWithComments());
  } catch (error) {
    response.send(error);
  }
});

app.post("/api/posts", async (request, response) => {
  try {
    // change creator
    response.send(await createPost(1, request.body.content));
  } catch (error) {
    response.send(error);
  }
});

app.delete("/api/posts/:id", async (request, response) => {
  try {
    response.send(await deletePost(request.params.id));
  } catch (error) {
    response.send(error);
  }
});

app.patch("/api/posts/:id", async (request, response) => {
  try {
    response.send(await updatePost(request.params.id, "123"));
  } catch (error) {
    response.send(error);
  }
});

// comments

app.post("/api/comments/:postId", async (request, response) => {
  try {
    response.send(
      await createComment(1, request.params.postId, request.body.content)
    );
  } catch (error) {
    response.send(error);
  }
});

app.delete("/api/comments/:id", async (request, response) => {
  try {
    response.send(await deleteComment(request.params.id));
  } catch (error) {
    response.send(error);
  }
});

app.patch("/api/comments/:id", async (request, response) => {
  try {
    response.send(await updateComment(request.params.id, request.body.content));
  } catch (error) {
    response.send(error);
  }
});

app.listen(3000, () => {
  console.log("Listen on the port 3000...");
});
