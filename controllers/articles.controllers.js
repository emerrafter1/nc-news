const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment,
  updateArticleVotes,
  insertArticle,
  removeArticle,
} = require("../models/articles.models");

const { checkExists } = require("../db/seeds/utils");

function getArticles(request, response, next) {
  const { sort_by, order, topic, page, limit } = request.query;

  promises = [fetchArticles(sort_by, order, topic, limit, page)];

  if (topic) {
    promises.push(checkExists("topics", "slug", topic));
  }

  Promise.all(promises)
    .then(([articles]) => {
      response.status(200).send({ articles: articles });
    })
    .catch((error) => {
      next(error);
    });
}

function getArticleById(request, response, next) {
  const { article_id } = request.params;

  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article: article });
    })
    .catch((error) => {
      next(error);
    });
}

function getCommentsByArticleId(request, response, next) {
  const { article_id } = request.params;
  const { page, limit } = request.query;

  fetchCommentsByArticleId(article_id, page, limit)
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

function postArticle(request, response, next) {
  const { author, title, body, topic, article_img_url } = request.body;

  insertArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      response.status(201).send({ article: article });
    })
    .catch((error) => {
      next(error);
    });
}

function deleteArticle(request, response, next) {
  const { article_id } = request.params;

  removeArticle(article_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error)
    });
}

module.exports = {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentOnArticle,
  patchArticleVotes,
  postArticle,
  deleteArticle,
};
