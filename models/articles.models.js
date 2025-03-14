const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

function fetchArticles(sort_by, order, topic, limit, page) {
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

  let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count 
  FROM articles 
  FULL JOIN comments 
  ON comments.article_id = articles.article_id`;

  const queryParams = [];
  let queryParamCount = 1;

  //WHERE

  if (topic) {
    query += ` WHERE articles.topic = $${queryParamCount}`;
    queryParams.push(topic);
    queryParamCount++;
  }

  //GROUP BY

  query += ` GROUP BY articles.article_id`;

  //ORDER BY

  if (allowedSortBy.includes(sort_by)) {
    query += ` ORDER BY ${sort_by}`;
  } else {
    query += ` ORDER BY articles.created_at`;
  }

  if (order === "ASC") {
    query += " ASC";
  } else {
    query += " DESC";
  }

  if (limit) {
    query += ` LIMIT $${queryParamCount}`;
    queryParams.push(limit);
    queryParamCount++;
  }

  if (page) {
    const offset = Number(page) * Number(limit);
    query += ` OFFSET $${queryParamCount}`;
    queryParams.push(offset);
  }

  if (
    (order && !allowedOrder.includes(order)) ||
    (sort_by && !allowedSortBy.includes(sort_by))
  ) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db.query(query, queryParams).then(({ rows }) => {
    return rows;
  });
}

function fetchArticleById(articleId) {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at::text AS created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
      FROM articles
      FULL JOIN comments
      ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
}

function fetchCommentsByArticleId(article_id, page, limit) {
  let query = `SELECT comment_id, votes, created_at, author, body, article_id FROM comments where article_id = $1 ORDER BY created_at DESC`;

  let queryParams = [article_id];
  let queryParamCount = 2;

  if (limit) {
    query += ` LIMIT $${queryParamCount}`;
    queryParams.push(limit);
    queryParamCount++;
  }

  if (page) {
    const offset = Number(page) * Number(limit);
    query += ` OFFSET $${queryParamCount}`;
    queryParams.push(offset);
  }

  return db.query(query, queryParams).then(({ rows }) => {
    if (rows.length === 0) {
      return checkExists("articles", "article_id", article_id)
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
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *, created_at::text AS created_at, 
    (SELECT CAST(COUNT(comments.comment_id) AS INT) 
     FROM comments 
     WHERE comments.article_id = articles.article_id) AS comment_count;`,
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

function insertArticle(
  author,
  title,
  body,
  topic,
  article_img_url = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
) {
  const values = [author, title, body, topic, article_img_url];

  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url) 
        VALUES ($1, $2, $3, $4 ,$5) 
        RETURNING *`,
      values
    )
    .then(({ rows }) => {
      rows[0].comment_count = 0;
      return rows[0];
    });
}

function removeArticle(article_id) {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1`, [article_id])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
}

module.exports = {
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment,
  updateArticleVotes,
  insertArticle,
  removeArticle,
};
