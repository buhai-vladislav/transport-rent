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

export class CreateDescriptionDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  maxSpeed: number;

  @IsNotEmpty()
  @IsEnum(TransportType)
  type: TransportType;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  seats: number;

  @IsNotEmpty()
  @IsNumber()
  power: number;

  @IsNotEmpty()
  @IsHexColor()
  color: string;

  @IsNotEmpty()
  @IsEnum(LicenceType)
  licenceType?: LicenceType = null;
}

export class CreateTransportDto {
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsObject()
  description: CreateDescriptionDto;

  @IsNotEmpty()
  @IsEnum(RentStatus)
  status: RentStatus;
}
