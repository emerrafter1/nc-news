const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

function fetchArticles(sort_by, order, topic) {
  const allowedSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const allowedOrder = ["ASC", "DESC"];

  let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles FULL JOIN comments ON comments.article_id = articles.article_id`;

  //WHERE

  if (topic) {
    query += ` WHERE articles.topic = '${topic}'`;
  }

  //GROUP BY

  query += ` GROUP BY articles.article_id`;

  //ORDER BY

  if (allowedSortBy.includes(sort_by)) {
    query += ` ORDER BY ${sort_by}`;
  } else if (sort_by && !allowedSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else {
    query += ` ORDER BY articles.created_at`;
  }

  if (order && !allowedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else if (order === "ASC") {
    query += " ASC";
  } else {
    query += " DESC";
  }

  return db.query(query).then(({ rows }) => {
    return rows;
  });
}

function fetchArticleById(articleId) {
  return db
    .query(
      `SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1;`,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
}

function fetchCommentsByArticleId(articleId) {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id FROM comments where article_id = $1 ORDER BY created_at DESC;`,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return checkExists("articles", "article_id", articleId)
          .then((response) => {
            if (response === true) {
              return [];
            }
          })
          .catch((error) => {
            return Promise.reject({ status: 404, msg: "Not found" });
          });
      }
      return rows;
    });
}

function insertComment(articleId, body, username) {
  const values = [articleId, body, username];

  return db
    .query(
      `INSERT INTO comments (article_id, body, author) VALUES($1, $2, $3) RETURNING *`,
      values
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function updateArticleVotes(inc_votes, articleId) {
  const values = [inc_votes, articleId];

  return fetchArticleById(articleId).then((article) => {
    if (article.votes === 0 && inc_votes < 0) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
        values
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        return rows[0];
      });
  });
}

module.exports = {
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment,
  updateArticleVotes,
};
