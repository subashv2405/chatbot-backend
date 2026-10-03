import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.enableCors({
    origin: 'http://localhost:3001',
  });
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`NestJS running on port ${port}`);
}
bootstrap();
