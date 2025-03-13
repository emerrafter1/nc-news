const { fetchTopics, insertTopic } = require("../models/topics.models");

function getTopics(request, response, next) {
  fetchTopics()
    .then((topics) => response.status(200).send({ topics: topics }))
    .catch((error) => {
      next(error);
    });
}

function postTopic(request, response, next) {
  const { slug, description } = request.body;



  insertTopic(slug, description)
    .then((topic) => response.status(201).send({ topic: topic }))
    .catch((error) => {
      next(error);
    });
}

module.exports = { getTopics, postTopic };
