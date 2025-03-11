const { removeComment } = require("../models/comments.models");

function deleteComment(request, response, next) {
  const {comment_id} = request.params;



  removeComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { deleteComment };
