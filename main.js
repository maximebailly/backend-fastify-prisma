import Fastify from "fastify";
import createApp from "./src/app.js";

const start = async () => {
  let app = Fastify({ logger: true });
  try {
    app.register(createApp);
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
