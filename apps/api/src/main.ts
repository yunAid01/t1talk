import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });

  // Global prefix
  app.setGlobalPrefix('api');

  // Redis Adapter 연결
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(Number(process.env.PORT) || 3009);
  console.log(
    `API Server running on http://localhost:${(process.env.PORT || 3009, '0.0.0.0')}`,
  );
  console.log(
    `Swagger UI: http://localhost:${process.env.PORT || 3009}/api-docs`,
  );
}
bootstrap();
