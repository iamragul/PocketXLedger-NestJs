import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async handleWebhooks(event) {
    console.log('Event: ', event);
    if (event.type === 'user.created') {
      const user = event.data;
      await this.prisma.user.create({
        data: { id: user.id, email: user.emailAddresses[0].emailAddress },
      });
    }
    return 'Webhook received';
  }
}
