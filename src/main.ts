import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer } from 'ldapjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // const server = createServer();
  // server.listen(1389, () => {
  //   console.log('LDAP server listening at %s', server.url);
  // });
}

bootstrap();
