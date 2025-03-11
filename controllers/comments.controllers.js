const { removeComment } = require("../models/comments.models");

function deleteComment(request, response, next) {
  const commentId = request.params.comment_id;



  removeComment(commentId)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { deleteComment };
