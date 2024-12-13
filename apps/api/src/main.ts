import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Allow your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    credentials: true, // Allow cookies to be sent
  });

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
