import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '#FF5733 ', type: String })
  transportId: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ type: Date, example: new Date() })
  fromDate?: Date;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: new Date() })
  toDate?: Date;
}
