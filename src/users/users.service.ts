import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Webhook } from 'svix';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async handleWebhooks(request: Request & { rawBody?: Buffer }) {
    try {
      const svixId = request.headers['svix-id'] as string | undefined;
      const svixTimestamp = request.headers['svix-timestamp'] as string | undefined;
      const svixSignature = request.headers['svix-signature'] as string | undefined;

      if (!svixId || !svixTimestamp || !svixSignature) {
        throw new BadRequestException('Missing Svix headers');
      }

      const payload = request.rawBody?.toString('utf8') ?? '';
      if (!payload) {
        throw new BadRequestException('Empty raw body');
      }

      const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
      if (!secret) {
        throw new InternalServerErrorException('Missing CLERK_WEBHOOK_SIGNING_SECRET');
      }

      const wh = new Webhook(secret);
      let evt: any;
      try {
        evt = wh.verify(payload, {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        });
      } catch (err) {
        throw new BadRequestException(`Invalid signature ${err.message}`);
      }
      const eventType = evt.type;
      switch (eventType) {
        case 'user.created': {
          const user = evt.data;

          const primary = user.email_addresses.find(
            (value: any) => value.id === user.primary_email_address_id,
          );

          await this.prisma.user.create({
            data: {
              id: user.id,
              first_name: user.first_name,
              last_name: user?.last_name,
              email: primary.email_address,
            },
          });
          return { message: 'User created successfully' };
        }
        case 'user.updated': {
          const user = evt.data;
          const primary = user.email_addresses?.find(
            (value: any) => value.id === user.primary_email_address_id,
          );
          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              email: primary.email_address,
              first_name: user.first_name,
              last_name: user?.last_name,
            },
          });
          return { message: 'User updated successfully' };
        }
        case 'user.deleted': {
          const user = evt.data;
          await this.prisma.user.delete({
            where: { id: user.id },
          });
          return { message: 'User deleted successfully' };
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

  async findAll() {
    const users = await this.prisma.user.findMany();
    return { users };
  }
}
