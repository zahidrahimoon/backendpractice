import 'dotenv/config';
import Fastify from 'fastify';
import routes from './routes/index.js';
import { connectDB, closeDB } from './db/index.js';
import { initializeSocket } from './socket/index.js';
import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});



// Register routes
fastify.register(routes);

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  await fastify.close();
  await closeDB();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';

    // Connect to database
    const dbConnected = await connectDB();
    if (!dbConnected) {
      console.warn('Starting server without database connection');
    }

    // Start Fastify server
    await fastify.listen({ port, host });
    console.log(`🚀 Server running at http://${host}:${port}`);

    // Initialize Socket.IO
    initializeSocket(fastify);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
