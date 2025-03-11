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

module.exports = { removeComment };
