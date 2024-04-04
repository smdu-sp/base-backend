import { Global, Injectable } from '@nestjs/common';
import { PrismaClient } from '@internal/prisma/client';

@Global()
@Injectable()
export class Prisma2Service extends PrismaClient {
  constructor() {
    super();
  }
}
