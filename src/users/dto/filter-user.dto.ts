import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsArray()
  roles?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number;
}
