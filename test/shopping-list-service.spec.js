require("dotenv").config();
const knex = require("knex");
const ListService = require("../src/shopping-list-service");

describe("Articles service object", () => {
  let db;
  let testArticles = [
    {
      id: 1,
      name: "First test post!",
      price: "10.00",
      category: "Snack",
      checked: true,
      date_added: new Date("2019-12-11 12:00:00")
    },
    {
      id: 2,
      name: "Second test post!",
      price: "5.00",
      category: "Main",
      checked: false,
      date_added: new Date("2019-12-11 12:00:00")
    },
    {
      id: 3,
      name: "Third test post!",
      price: "8.00",
      category: "Lunch",
      checked: true,
      date_added: new Date("2019-12-11 12:00:00")
    }
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db("shopping_list").truncate());
  afterEach(() => db("shopping_list").truncate());
  after(() => db.destroy());

  context("Given 'shopping_list' has data", () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testArticles);
    });

    it(`getById() resolves an article by id from 'blogful_articles' table`, () => {
      const thirdId = 3;
      const thirdTestArticle = testArticles[thirdId - 1];
      return ListService.getById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          id: thirdId,
          name: thirdTestArticle.name,
          price: thirdTestArticle.price,
          category: thirdTestArticle.category,
          checked: thirdTestArticle.checked,
          date_added: thirdTestArticle.date_added
        });
      });
    });

    it(`updateArticle() updates an article from the 'shopping_list' table`, () => {
      const idOfArticleToUpdate = 3;
      const newArticleData = {
        name: "updated name",
        price: "4.00",
        category: "Main",
        checked: false,
        date_added: new Date("2019-12-11 12:00:00")
      };
      return ListService.updateArticle(db, idOfArticleToUpdate, newArticleData)
        .then(() => ListService.getById(db, idOfArticleToUpdate))
        .then(article => {
          expect(article).to.eql({
            id: idOfArticleToUpdate,
            ...newArticleData
          });
        });
    });

    it("deleteArticle() removes an article by id from 'shopping_list' table", () => {
      const articleId = 3;
      return ListService.deleteArticle(db, articleId)
        .then(() => ListService.getAllItems(db))
        .then(allArticles => {
          const expected = testArticles.filter(
            article => article.id !== articleId
          );
          expect(allArticles).to.eql(expected);
        });
    });

    it("getAllItems() resolves all articles from 'shopping_list' table", () => {
      return ListService.getAllItems(db).then(actual => {
        expect(actual).to.eql(testArticles);
      });
    });
  });

  context("Given shopping list with no data, returns empty array", () => {
    it("getAllItems() resolves an empty array", () => {
      return ListService.getAllItems(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });

    it("insertArticle() inserts an article and resolves the article with an 'id'", () => {
      const newArticle = {
        id: 4,
        name: "New test post!",
        price: "18.00",
        category: "Lunch",
        checked: true,
        date_added: new Date("2019-12-11 12:00:00")
      };
      return ListService.insertArticle(db, newArticle).then(actual => {
        expect(actual).to.eql({
          id: newArticle.id,
          name: newArticle.name,
          price: newArticle.price,
          category: newArticle.category,
          checked: newArticle.checked,
          date_added: newArticle.date_added
        });
      });
    });
  });
});
