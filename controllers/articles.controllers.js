const {
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment,
  updateArticleVotes,
  insertArticle
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


function postArticle(request, response, next){

const {author,
  title,
  body,
  topic,
  article_img_url} = request.body

  insertArticle(author,
    title,
    body,
    topic,
    article_img_url)
  .then((article) => {
    response.status(201).send({ article: article });
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
  postArticle
};
