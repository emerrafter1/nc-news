const db = require("../db/connection");

function removeComment(commentId) {
  return db
    .query(`DELETE FROM comments where comment_id = $1;`, [commentId])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
}

function updateCommentVotes(inc_votes, commentId) {
  const values = [inc_votes, commentId];


  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *, created_at::text AS created_at`,
      values
    )
    .then(({ rows }) => {

      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
}

module.exports = { removeComment, updateCommentVotes };
