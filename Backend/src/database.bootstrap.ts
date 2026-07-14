import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';

loadEnv({ path: resolve(process.cwd(), '.env') });

/**
 * Starts an in-memory MongoDB when USE_MEMORY_DB=true (default for local demo
 * without Docker). Otherwise rely on MONGODB_URI.
 */
export async function ensureDatabase(): Promise<void> {
  const useMemory =
    process.env.USE_MEMORY_DB === 'true' || process.env.USE_MEMORY_DB === '1';

  if (!useMemory) {
    return;
  }

  console.log(
    'Starting in-memory MongoDB (first run may download binaries)...',
  );
  const memoryServer = await MongoMemoryServer.create({
    instance: {
      launchTimeout: 180000,
    },
  });
  process.env.MONGODB_URI = memoryServer.getUri('objects');
  console.log(`Using in-memory MongoDB at ${process.env.MONGODB_URI}`);
}
