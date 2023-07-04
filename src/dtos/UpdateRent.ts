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
  @ApiProperty({ example: new Date() })
  fromDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty({ example: new Date() })
  toDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty({ example: new Date() })
  stoppedAt?: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '64a3f42b837b437a76e989c5 ', type: String })
  transportId: string;
}
