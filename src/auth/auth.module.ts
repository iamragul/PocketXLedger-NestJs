import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';

import { ClerkStrategy } from './clerk.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'clerk' })],
  controllers: [],
  providers: [ClerkStrategy, ClerkClientProvider],
  exports: [PassportModule],
})
export class AuthModule {}
