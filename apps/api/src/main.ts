import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8000);

  // swagger
  // const config = new DocumentBuilder()
  //   .setTitle('Movies API')
  //   .setDescription('The Movies API documentation')
  //   .setVersion('1.0')
  //   .addBasicAuth() // For username/password auth
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  // // ...
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
}
bootstrap();
