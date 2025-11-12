import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "*" });

  // Global prefix
  app.setGlobalPrefix("api");

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("My API")
    .setDescription("API documentation")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(process.env.PORT ?? 3009);
  console.log(
    `API Server running on http://localhost:${process.env.PORT ?? 3009}`
  );
  console.log(`Swagger UI: http://localhost:${process.env.PORT ?? 3009}/api-docs`);
}
bootstrap();
