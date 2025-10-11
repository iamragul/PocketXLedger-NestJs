import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'clerk' })],
  controllers: [],
  providers: [],
  exports: [PassportModule],
})
export class AuthModule {}
