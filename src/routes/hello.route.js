// Define hello route for fastify app

export default async (app, opts) => {
  app.get("/", async (request, reply) => {
    return { hello: "world" };
  });
  // Parametrized route with validation
  const opt = {
    schema: {
      params: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            hello: { type: "string" },
          },
        },
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  };

  app.get("/hello/:name", opt, async (request, reply) => {
    const { name } = request.params;
    if (name.length == 0) {
      reply.code(400);
      return { error: "Name is required" };
    }
    return { hello: request.params.name };
  });
};
