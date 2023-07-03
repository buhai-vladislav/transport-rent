import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  transportId: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  fromDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  toDate?: Date;
}
