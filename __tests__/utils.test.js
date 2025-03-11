const {
  convertTimestampToDate,
  createLookupObject,
  checkExists
} = require("../db/seeds/utils");
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createLookupObject", () => {
  test("Function returns an object", () => {
    const inputData = [
      {
        article_id: 1,
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1604728980000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
      },
    ];

    const actual = createLookupObject(inputData, "title", "article_id");

    expect(typeof actual).toBe("object");
  });

  test("Function returns a lookup object with a single key value pair with the targetKey and targetValue for a single  data object", () => {
    const inputData = [
      {
        article_id: 1,
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 1604728980000,
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700",
      },
    ];

    const expected = { "Running a Node App": 1 };

    const actual = createLookupObject(inputData, "title", "article_id");

    expect(actual).toEqual(expected);
  });

  test(
    "Function returns a lookup object multiple key value pairs for multiple data objects",
    () => {
      const inputData = [
        {
          article_id: 1,
          title: "Moustache",
          topic: "mitch",
          author: "butter_bridge",
          body: "Have you seen the size of that thing?",
          created_at: 1602419040000,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
        {
          article_id: 2,
          title: "Another article about Mitch",
          topic: "mitch",
          author: "butter_bridge",
          body: "There will never be enough articles about Mitch!",
          created_at: 1602419040000,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      ];

      const expected = {"Moustache": 1, "Another article about Mitch": 2}

      const actual = createLookupObject(inputData, "title", "article_id")

      expect(actual).toEqual(expected)
    }
  );

  test("Function does not mutate the input data", () => {
    const inputData = [
      {
        article_id: 1,
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: 1602419040000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 2,
        title: "Another article about Mitch",
        topic: "mitch",
        author: "butter_bridge",
        body: "There will never be enough articles about Mitch!",
        created_at: 1602419040000,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];

    const expected = {"Moustache": 1, "Another article about Mitch": 2}

    const actual = createLookupObject(inputData, "title", "article_id")

    expect(actual).not.toBe(expected)





  });
});



describe("checkExists", () => {

  beforeEach(() => seed(data));

  afterAll(() => db.end());



  test("returns true if the resource exits", () => {
    checkExists("users", "username", "butter_bridge").then((response) => {
      expect(response).toBe(true);
    });
  });

  test("returns resource not found if the resource does not exit", () => {
    checkExists("articles", "title", "How to make a grilled cheese").then(
      (response) => {
        expect(response.status).toBe(404);
        expect(response.msg).toBe("Resource not found");
      }
    );
  });
});