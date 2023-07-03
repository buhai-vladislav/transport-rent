import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRentDto {
  @IsOptional()
  @IsDate()
  @ApiProperty()
  fromDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  toDate?: Date;

  @IsOptional()
  @IsDate()
  stoppedAt?: Date;

  @IsString()
  @IsNotEmpty()
  transportId: string;
}
