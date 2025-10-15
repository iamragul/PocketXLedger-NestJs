import { CategoryType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  icon: string;

  @IsEnum(CategoryType)
  type: CategoryType;
}
