import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOptions } from './config/corsOptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(corsOptions);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
