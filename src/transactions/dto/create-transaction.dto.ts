import { PaymentMethod, RecurrenceType, TransactionType } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsOptional()
  description?: string;

  @IsDate()
  date: Date;

  @IsUUID()
  category_id: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @IsBoolean()
  @IsOptional()
  recurring?: boolean = false;

  @ValidateIf((o) => o.recurring === true)
  @IsDefined()
  @IsEnum(RecurrenceType)
  recurrence_type?: RecurrenceType;
}
