import { NestFactory, Reflector } from '@nestjs/core';
import { ApplicationModule } from './modules/Application';
import { Logger, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './guards/JwtGuard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JWT_BEARER_SWAGGER_AUTH_NAME } from './utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  const logger = new Logger('NestApplication');
  const reflector = app.get(Reflector);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  const config = new DocumentBuilder()
    .setTitle('Transport Rent project API')
    .setDescription('The Transport Rent project API endpoints documentation.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      JWT_BEARER_SWAGGER_AUTH_NAME, // This name here is important for matching up with @ApiBearerAuth() in the controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  logger.log(`Server started on the ${ApplicationModule.port} port.`);
  await app.listen(ApplicationModule.port || 3000);
}
bootstrap();
