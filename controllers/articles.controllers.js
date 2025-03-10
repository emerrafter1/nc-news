const {
  fetchArticles,
  fetchArticleById,
} = require("../models/articles.models");

function getArticles(request, response, next) {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles: articles });
  });
}

function getArticleById(request, response, next) {
  const articleId = request.params.article_id;

  fetchArticleById(articleId)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getArticles, getArticleById };
