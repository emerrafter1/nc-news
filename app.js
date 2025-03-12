const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const apiRouter = require("./routes/api-router");

const {
  handleServerErrors,
  handlePsqlError,
  handleCustomErrors,
} = require("./controllers/errors.controllers");

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

app.use("/api", apiRouter);

app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlError);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
