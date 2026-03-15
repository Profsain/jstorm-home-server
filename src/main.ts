import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Update CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:5173',
      'http://localhost:3000',
      'https://jstormhomes-project.vercel.app', // Add potential production URL
      'https://jstorm-homes-platform.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Simple logging middleware for errors
  app.use((req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    res.send = function(body: any) {
      if (res.statusCode >= 400) {
        console.error(`Error ${res.statusCode} on ${req.method} ${req.url}:`, body);
      }
      return originalSend.apply(res, arguments as any);
    };
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('JStorm Homes API')
    .setDescription('The JStorm Homes platform API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available on: http://localhost:${port}/api`);
}
bootstrap();
