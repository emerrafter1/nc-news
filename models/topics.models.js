const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT slug, description FROM topics;`).then(({ rows }) => {
    return rows;
  });
}

function insertTopic(slug, description) {
  const queryParams = [slug, description];

  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
      queryParams
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = { fetchTopics, insertTopic };
