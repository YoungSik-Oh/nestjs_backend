import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AccessLogInterceptor } from './interceptor/access_log_interceptor';
import { FileConsoleLogger } from './logger/file_console_logger';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('server.port');

  app.useGlobalInterceptors(new AccessLogInterceptor());

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.useLogger(
    new FileConsoleLogger({
      filename: config.get('logger.filename'),
      dirname: process.cwd() + config.get('logger.dirname'),
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validation을 위한 decorator가 붙어있지 않은 속성들은 무시(제거)
      forbidNonWhitelisted: true, // 유효성 검사 데코레이드터를 사용하지 않는 값은 요청조차 불가, 바로 에러 응답 반환
      transform: true, // 일반 JavaScript객체로 들어오는 요청을 자동으로 DTO클래스로 변환
    }),
  );

  await app.listen(port);
  logger.log(`connect Server port : ${port}`);
}
bootstrap();
