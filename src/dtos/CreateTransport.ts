import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from '@nestjs/class-validator';
import {
  LicenceType,
  RentStatus,
  TransportType,
} from '../db/schemas/Transport';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateDescriptionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'VW Passat B6', type: String })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 120, type: Number })
  maxSpeed: number;

  @IsNotEmpty()
  @IsEnum(TransportType)
  @ApiProperty({ enum: TransportType, default: TransportType.CAR })
  type: TransportType;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1200, type: Number })
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 6, type: Number })
  seats: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 120, type: Number })
  power: number;

  @IsNotEmpty()
  @IsHexColor()
  @ApiProperty({ example: '#FF5733 ' })
  color: string;

  @IsNotEmpty()
  @IsEnum(LicenceType)
  @ApiProperty({ enum: LicenceType, default: LicenceType.A })
  licenceType?: LicenceType = null;
}

export class CreateTransportDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 120, type: Number })
  price: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'VW Passat B6', type: String })
  title: string;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({ type: CreateDescriptionDto })
  description: CreateDescriptionDto;

  @IsNotEmpty()
  @IsEnum(RentStatus)
  @ApiProperty({ enum: RentStatus, default: RentStatus.FREE })
  status?: RentStatus = RentStatus.FREE;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '64a3f42b837b437a76e989c5' })
  imageId?: string;
}
