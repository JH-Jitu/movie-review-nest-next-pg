import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Allow your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    credentials: true, // Allow cookies to be sent
  });

  const uploadPath = join(process.cwd(), 'uploads');
  console.log('Upload path:', uploadPath); // Add this to verify the path

  app.use('/uploads', express.static(uploadPath));

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription('The Movies API documentation')
    .setVersion('1.0')
    .addBearerAuth() // For username/password auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // // ...

  app.useGlobalInterceptors(new TransformInterceptor());

  //
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableShutdownHooks();
  await app.listen(8001);
}
bootstrap();
