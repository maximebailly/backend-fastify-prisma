// jest test for the books.route.js

import Fastify from "fastify";
import build from "./helper.js";

describe("books route", () => {
  let app = build(); // build the app

  // Test data
  const testBook = {
    title: "Test Book",
    author: "Test Author"
  };

  // Clean up after all tests
  afterAll(async () => {
    await app.prisma.book.deleteMany();
    await app.close();
  });

  describe("GET /books", () => {
    test("should return empty array when no books exist", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/books",
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual([]);
    });
  });

  describe("POST /books", () => {
    test("should create a new book", async () => {
      const newBook = {
        title: "New Book",
        author: "New Author"
      };

      const res = await app.inject({
        method: "POST",
        url: "/books",
        payload: newBook,
      });
      expect(res.statusCode).toBe(201);
      expect(res.json()).toMatchObject(newBook);
      expect(res.json()).toHaveProperty("id");
    });

    test("should handle invalid book data", async () => {
      const invalidBook = {
        title: "", // Empty title
        author: "Test Author"
      };

      const res = await app.inject({
        method: "POST",
        url: "/books",
        payload: invalidBook,
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /books/:id", () => {
    let bookId;

    beforeEach(async () => {
      // Create a test book before each test in this describe block
      const createRes = await app.inject({
        method: "POST",
        url: "/books",
        payload: testBook,
      });
      bookId = createRes.json().id;
    });

    test("should return a specific book", async () => {
      const res = await app.inject({
        method: "GET",
        url: `/books/${bookId}`,
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toMatchObject(testBook);
    });

    test("should return 404 for non-existent book", async () => {
      const res = await app.inject({
        method: "GET",
        url: "/books/999999",
      });
      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({ error: "Book not found" });
    });
  });

  describe("PUT /books/:id", () => {
    let bookId;

    beforeEach(async () => {
      // Create a test book before each test in this describe block
      const createRes = await app.inject({
        method: "POST",
        url: "/books",
        payload: testBook,
      });
      bookId = createRes.json().id;
    });

    test("should update an existing book", async () => {
      const updatedBook = {
        title: "Updated Book",
        author: "Updated Author"
      };

      const res = await app.inject({
        method: "PUT",
        url: `/books/${bookId}`,
        payload: updatedBook,
      });
      expect(res.statusCode).toBe(200);
      expect(res.json()).toMatchObject(updatedBook);
    });

    test("should return 404 when updating non-existent book", async () => {
      const res = await app.inject({
        method: "PUT",
        url: "/books/999999",
        payload: testBook,
      });
      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({ error: "Book not found" });
    });
  });

  describe("DELETE /books/:id", () => {
    let bookId;

    beforeEach(async () => {
      // Create a test book before each test in this describe block
      const createRes = await app.inject({
        method: "POST",
        url: "/books",
        payload: testBook,
      });
      bookId = createRes.json().id;
    });

    test("should delete an existing book", async () => {
      const res = await app.inject({
        method: "DELETE",
        url: `/books/${bookId}`,
      });
      expect(res.statusCode).toBe(204);

      // Verify the book is deleted
      const getRes = await app.inject({
        method: "GET",
        url: `/books/${bookId}`,
      });
      expect(getRes.statusCode).toBe(404);
    });

    test("should return 404 when deleting non-existent book", async () => {
      const res = await app.inject({
        method: "DELETE",
        url: "/books/999999",
      });
      expect(res.statusCode).toBe(404);
      expect(res.json()).toEqual({ error: "Book not found" });
    });
  });
});
