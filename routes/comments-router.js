const commentsRouter = require("express").Router();
const { deleteComment,patchCommentVotes } = require("../controllers/comments.controllers");

commentsRouter.route("/:comment_id").patch(patchCommentVotes).delete(deleteComment);

module.exports = commentsRouter;
