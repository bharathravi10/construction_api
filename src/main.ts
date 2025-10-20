import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
  }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  const config = new DocumentBuilder()
    .setTitle('Construction Application API')
    .setDescription('API documentation for the Construction Application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
