import { verifyWebhook } from '@clerk/backend/webhooks';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async handleWebhooks(request: Request) {
    try {
      const evt = await verifyWebhook(request);
      const eventType = evt.type;
      switch (eventType) {
        case 'user.created': {
          const user = evt.data;

          const emailId = user.email_addresses.filter(
            (email) => email.id === user.primary_email_address_id,
          );

          await this.prisma.user.create({
            data: { id: user.id, email: emailId[0].email_address },
          });
          return { message: 'User created successfully' };
        }

        default:
          console.warn(`Unhandled event type: ${eventType}`);
          return { message: `Unhandled event type: ${eventType}` };
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw new InternalServerErrorException('Error handling webhook');
    }
  }
}
