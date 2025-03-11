const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment,
  updateArticleVotes,
} = require("../models/articles.models");

const { checkExists } = require("../db/seeds/utils");

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

function postCommentOnArticle(request, response, next) {
  const articleId = request.params.article_id;
  const { username, body } = request.body;


  insertComment(articleId, body, username)
    .then((comment) => {
      response.status(201).send({ comment: comment });
    })
    .catch((error) => {
      next(error);
    });
}

function patchArticleVotes(request, response, next) {
  const articleId = request.params.article_id;
  const { inc_votes } = request.body;

  updateArticleVotes(inc_votes, articleId)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentOnArticle,
  patchArticleVotes,
};
