import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('/webhooks')
  webhooks(@Body() payload: any) {
    return this.usersService.handleWebhooks(payload);
  }
}
