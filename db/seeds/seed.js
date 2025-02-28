const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createLookupObject } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics");
    })
    .then(() => {
      return db.query(
        "CREATE TABLE topics ( slug VARCHAR(255) PRIMARY KEY,description VARCHAR(255) NOT NULL, img_url VARCHAR(1000));"
      );
    })
    .then(() => {
      return db.query(
        "CREATE TABLE users ( username VARCHAR(255) PRIMARY KEY, name VARCHAR(255) NOT NULL, avatar_url VARCHAR(1000) NOT NULL);"
      );
    })
    .then(() => {
      return db.query(
        "CREATE TABLE articles ( article_id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, topic VARCHAR(255) NOT NULL REFERENCES topics(slug), author VARCHAR(255) NOT NULL REFERENCES users(username), body TEXT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT NOW(), votes INT DEFAULT 0, article_img_url VARCHAR(1000))"
      );
    })
    .then(() => {
      return db.query(
        "CREATE TABLE comments ( comment_id SERIAL PRIMARY KEY, article_id INT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE, body TEXT NOT NULL, votes INT DEFAULT 0, author VARCHAR(255) REFERENCES users(username), created_at TIMESTAMP DEFAULT NOW())"
      );
    })
    .then(() => {
      const formattedTopicData = topicData.map((topic) => [
        topic.description,
        topic.slug,
        topic.img_url,
      ]);

      const insertTopicDataQuery = format(
        `INSERT INTO topics (description, slug, img_url) VALUES %L RETURNING *;`,
        formattedTopicData
      );

      return db.query(insertTopicDataQuery);
    })
    .then(() => {
      const formattedUserData = userData.map((user) => [
        user.username,
        user.name,
        user.avatar_url,
      ]);
      const insertUserDataQuery = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
        formattedUserData
      );
      return db.query(insertUserDataQuery);
    })
    .then(() => {
      const formattedArticleData = articleData.map((article) => [
        article.title,
        article.topic,
        article.author,
        article.body,
        convertTimestampToDate({ created_at: article.created_at }).created_at,
        article.votes,
        article.article_img_url,
      ]);

      const insertArticleDataQuery = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticleData
      );

      return db.query(insertArticleDataQuery);
    })
    .then(({ rows }) => {
      const articleLookup = createLookupObject(rows, "title", "article_id");

      const formattedCommentData = commentData.map((comment) => [
        articleLookup[comment.article_title],
        comment.body,
        comment.votes,
        comment.author,
        convertTimestampToDate({ created_at: comment.created_at }).created_at,
      ]);

      const insertCommentDataQuery = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at)VALUES %L`,
        formattedCommentData
      );


      return db.query(insertCommentDataQuery);
    });
};

module.exports = seed;
