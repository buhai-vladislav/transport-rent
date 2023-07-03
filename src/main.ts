import { NestFactory, Reflector } from '@nestjs/core';
import { ApplicationModule } from './modules/Application';
import { Logger, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './guards/JwtGuard';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  const logger = new Logger('NestApplication');
  const reflector = app.get(Reflector);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  logger.log(`Server started on the ${ApplicationModule.port} port.`);
  await app.listen(ApplicationModule.port || 3000);
}
bootstrap();
