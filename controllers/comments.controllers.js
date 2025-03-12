const { removeComment, updateCommentVotes } = require("../models/comments.models");

function deleteComment(request, response, next) {
  const { comment_id } = request.params;

  removeComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
}

function patchCommentVotes(request, response, next) {
  const { comment_id } = request.params;
  const { inc_votes } = request.body;


  updateCommentVotes(inc_votes, comment_id)
    .then((comment) => {
      response.status(200).send({ comment: comment });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { deleteComment, patchCommentVotes };
