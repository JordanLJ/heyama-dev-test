import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ensureDatabase } from './database.bootstrap';

function corsOrigins(): string | string[] | boolean {
  const raw = process.env.CORS_ORIGIN;
  if (!raw || raw === '*') return true;
  return raw.split(',').map((o) => o.trim()).filter(Boolean);
}

async function bootstrap() {
  await ensureDatabase();

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: corsOrigins(),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`API listening on http://0.0.0.0:${port}`);
}
bootstrap();
