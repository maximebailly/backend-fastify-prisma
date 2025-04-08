// jest test ffor the hello.route.js

import Fastify from "fastify";
import build from "./helper.js";

describe("hello route", () => {
  let app = build(); // build the app

  test("GET /", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/",
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ hello: "world" });
  });

  test("GET /hello/:name", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/hello/John",
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ hello: "John" });
  });

  test("GET /hello/:name with empty name", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/hello/",
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ error: "Name is required" });
  });
});
