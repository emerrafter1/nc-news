const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId
} = require("../models/articles.models");

function getArticles(request, response, next) {
  fetchArticles()
    .then((articles) => {
      response.status(200).send({ articles: articles });
    })
    .catch((error) => {
      next(error);
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

function getCommentsByArticleId(request, response, next) {
    const articleId = request.params.article_id;
  
    fetchCommentsByArticleId(articleId)
      .then((comments) => {
        response.status(200).send({ comments: comments });
      })
      .catch((error) => {
        next(error);
      });
  }

module.exports = { getArticles, getArticleById, getCommentsByArticleId };
