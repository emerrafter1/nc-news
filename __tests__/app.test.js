const endpointsJson = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("ANY: /notapath", () => {
  test("404: responds with error message when path is not found", () => {
    return request(app)
      .get("/notapath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object detailing the slug and description of all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:articleId", () => {
  test("200: Responds with an object detailing the article", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toBe(7);
        expect(article.author).toBe("icellusedkars");
        expect(article.title).toBe("Z");
        expect(article.body).toBe("I was hungry.");
        expect(article.title).toBe("Z");
        expect(article.created_at).toBe("2020-01-07T14:08:00.000Z");
        expect(article.votes).toBe(0);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("400: Responds with bad request when an invalid request is made", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with not found when a valid request is made but the record does not exist", () => {
    return request(app)
      .get("/api/articles/799")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(articles).toBeSorted("created_at", { descending: true });
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(Object.hasOwnProperty(article, "body")).toBe(false);
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(9);
        });
      });
  });

  test("200: Responds with an empty array of comments when an valid article has no comments", () => {
    return request(app)
      .get("/api/articles/8/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(0);
      });
  });

  test("400: Responds with bad request when an invalid request is made", () => {
    return request(app)
      .get("/api/articles/spaghetti/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: Responds with not found when a valid request is made but the record does not exist", () => {
    return request(app)
      .get("/api/articles/989/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with an object of the posted comment", () => {
    const commentRequest = {
      username: "icellusedkars",
      body: "I loved learning about this",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(commentRequest)
      .expect(201)
      .then(({ body }) => {
        const currentTime = new Date();
        const tolerance = 20;
        const comment = body.comment;
        const createdAt = new Date(comment.created_at);

        expect(comment.comment_id).toBe(19);
        expect(comment.article_id).toBe(4);
        expect(comment.body).toBe("I loved learning about this");
        expect(comment.votes).toBe(0);
        expect(comment.author).toBe("icellusedkars");

        expect(Math.abs(currentTime - createdAt)).toBeLessThanOrEqual(
          tolerance
        );
      });
  });

  test("400: Responds with bad request when a username is used that does not belong to an existing user", () => {
    const commentRequest = {
      username: "tester123",
      body: "This article was really interesting",
    };
    return request(app)
      .post("/api/articles/11/comments")
      .send(commentRequest)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: Responds with bad request when a request is made to an invalid endpoint", () => {
    const commentRequest = {
      username: "icellusedkars",
      body: "This article was really interesting",
    };
    return request(app)
      .post("/api/articles/spaghetti/comments")
      .send(commentRequest)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: Responds with bad request when an invalid request is made to a valid endpoint", () => {
    const commentRequest = { username: "icellusedkars", body: null };
    return request(app)
      .post("/api/articles/7/comments")
      .send(commentRequest)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: Responds with not found when a valid request is made but the record does not exist", () => {
    return request(app)
      .get("/api/articles/989/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/articles/:articleId", () => {
  test("200: Responds with an object detailing the article including a votes increase of 10", () => {
    const votesRequest = { inc_votes: 10 };

    return request(app)
      .patch("/api/articles/2")
      .send(votesRequest )
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toBe(2);
        expect(article.author).toBe("icellusedkars");
        expect(article.title).toBe("Sony Vaio; or, The Laptop");
        expect(article.body).toBe("Call me Mitchell. Some years ago..");
        expect(article.created_at).toBe("2020-10-16T05:03:00.000Z");
        expect(article.votes).toBe(10);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("200: Responds with an object detailing the article including a votes decrease of 30", () => {
    const votesRequest = { inc_votes: -30 };

    return request(app)
      .patch("/api/articles/1")
      .send( votesRequest )
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toBe(1);
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(70);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("400: Responds with bad request when a vote decrease request is made to an article with no votes", () => {
    const votesRequest = { inc_votes: -40 };
    return request(app)
      .patch("/api/articles/3")
      .send(votesRequest)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: Responds with bad request when a request is made to an invalid endpoint", () => {
    const votesRequest = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/banana")
      .send(votesRequest)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400: Responds with bad request when an invalid request is made to a valid endpoint", () => {
    const votesRequest = { inc_votes: "cheese" };
    return request(app)
      .patch("/api/articles/7")
      .send(votesRequest)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: Responds with not found when a valid request is made but the record does not exist", () => {
    const votesRequest = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/799")
      .send(votesRequest)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
