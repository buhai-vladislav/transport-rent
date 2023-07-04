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
  @ApiProperty({ example: '#FF5733 ', type: String })
  transportId: string;

  @IsOptional()
  @IsDate()
  @ApiProperty({ type: Date, example: new Date() })
  fromDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty({ example: new Date() })
  toDate?: Date;
}
