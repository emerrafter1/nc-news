const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
} = require("./controllers/articles.controllers");
const {
  handleServerErrors,
  handlePsqlError,
  handleCustomErrors,
} = require("./controllers/errors.controllers");

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlError);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
