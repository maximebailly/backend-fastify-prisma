// helper functions for jest tests

import Fastify from "fastify";
import { PrismaClient } from '@prisma/client';
import prismaPlugin from "../src/plugins/prisma.js";
import registerApp from "../src/app.js";
import { execSync } from 'child_process';

// Create a test database URL
const TEST_DATABASE_URL = 'file:./test.db';

export default build = () => {
  let app = Fastify();

  beforeAll(async () => {
    // Set up test database URL
    process.env.DATABASE_URL = TEST_DATABASE_URL;
    
    execSync('npx prisma migrate reset --force --skip-seed', {
      env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    });


    // Register the Prisma plugin first
    await app.register(prismaPlugin);
    
    // Register the app with the test database
    await app.register(registerApp);
    await app.ready();
  });

  afterAll(async () => {
    // Clean up the test database
    await app.prisma.book.deleteMany();
    await app.close();
  });

  return app;
};
