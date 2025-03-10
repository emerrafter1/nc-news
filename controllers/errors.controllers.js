function handleServerErrors(error, request, response, next) {
    response.status(500).send({msg: "Server Error"})
}

module.exports = { handleServerErrors };
