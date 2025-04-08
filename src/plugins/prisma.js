import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

async function prismaPlugin(fastify, options) {
  const dbUrl = process.env.DATABASE_URL;
  let prisma_args = {};
  if (!dbUrl) {
    prisma_args = {
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    };
  }
  const prisma = new PrismaClient(prisma_args);

  await prisma.$connect();
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });
}

export default fp(prismaPlugin);
