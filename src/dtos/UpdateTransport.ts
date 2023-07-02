import {
  IsEnum,
  IsHexColor,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import {
  TransportType,
  LicenceType,
  RentStatus,
} from '../db/schemas/Transport';
import { CreateDescriptionDto } from './CreateTransport';

export class UpdateDescriptionDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  maxSpeed?: number;

  @IsOptional()
  @IsEnum(TransportType)
  type?: TransportType;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  seats?: number;

  @IsOptional()
  @IsNumber()
  power?: number;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  @IsEnum(LicenceType)
  licenceType?: LicenceType = null;
}

export class UpdateMainTransportDto {
  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(RentStatus)
  status?: RentStatus;
}

export class UpdateTransportDto {
  @IsOptional()
  @IsObject()
  description?: CreateDescriptionDto;

  @IsOptional()
  @IsObject()
  transport?: UpdateMainTransportDto;
}
