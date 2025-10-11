import { Controller, Post, Req } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/webhooks')
  async webhooks(@Req() request: Request) {
    return this.usersService.handleWebhooks(request);
  }
}
