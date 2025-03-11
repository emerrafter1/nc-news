function handlePsqlError(error, request, response, next) {
  if (error.code === "22P02" || error.code === "23503" || error.code === "23502" ) {
    response.status(400).send({ msg: "Bad request" });
  }
  next(error);
}

function handleCustomErrors(error, request, response, next) {
  if (error.status) {
    response.status(error.status).send({ msg: error.msg });
  }
  next(error);
}

function handleServerErrors(error, request, response, next) {
  response.status(500).send({ msg: "Server Error" });
}

module.exports = { handleServerErrors, handlePsqlError, handleCustomErrors };
