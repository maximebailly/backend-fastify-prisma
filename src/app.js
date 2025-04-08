// function to create the fastify instance

import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyStatic from '@fastify/static';
import path from 'path';
import cookie from '@fastify/cookie';
import session from '@fastify/session';

const swaggerOptions = {
  swagger: {
    info: {
      title: "My Title",
      description: "My Description.",
      version: "1.0.0",
    },
    host: "localhost",
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [{ name: "Default", description: "Default" }],
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};

import helloRoute from "./routes/hello.route.js";
import booksMemoryRoute from "./routes/books.memory.route.js";
import booksRoute from "./routes/books.route.js";
import prismaPlugin from "./plugins/prisma.js";

const registerApp = async (app, opt) => {
  app.register(fastifySwagger, swaggerOptions);
  app.register(fastifySwaggerUi, swaggerUiOptions);
  app.register(prismaPlugin); 

  app.register(helloRoute);
  app.register(booksMemoryRoute, { prefix: "/booksmemory" });
  app.register(booksRoute, { prefix: "/books" });
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'public'),
    prefix: '/',
  });
  app.register(cookie);
  app.register(session, {
    secret: 'un_secret_pour_la_session',
    cookie: { secure: false },
  });
};

export default registerApp;