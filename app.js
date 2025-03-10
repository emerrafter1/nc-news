const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const {
  getTopics,
  getArticleById,
} = require("./controllers/topics.controllers");
const {
  handleServerErrors,
  handlePsqlError,
  handleCustomErrors
} = require("./controllers/errors.controllers");

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlError);

app.use(handleCustomErrors)

app.use(handleServerErrors);

module.exports = app;
