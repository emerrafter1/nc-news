const {fetchTopics, fetchArticleById} = require("../models/topics.models")

function getTopics(request, response){

    fetchTopics().then((topics) =>
    response.status(200).send({topics: topics}))
}

function getArticleById(request, response, next){

    const articleId = request.params.article_id
    

    fetchArticleById(articleId).then((article) => {
        response.status(200).send({article: article})
    }).catch((error) => {
        next(error)
    })
}

module.exports = {getTopics, getArticleById}