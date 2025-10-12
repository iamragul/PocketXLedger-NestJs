import { Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/webhooks')
  async webhooks(@Req() request: Request & { rawBody?: Buffer }) {
    return this.usersService.handleWebhooks(request);
  }
}
