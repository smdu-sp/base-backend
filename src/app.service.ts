import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string } {
    return { message: 'Hello World!' };
  }
  getOla(): { message: string } {
    return { message: 'Olá, Mundo!' };
  }
}
