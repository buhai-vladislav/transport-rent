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
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDescriptionDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'VW Passat B6', type: String })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 120, type: Number })
  maxSpeed?: number;

  @IsOptional()
  @IsEnum(TransportType)
  @ApiProperty({ enum: TransportType, default: TransportType.CAR })
  type?: TransportType;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1200, type: Number })
  weight?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 6, type: Number })
  seats?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 120, type: Number })
  power?: number;

  @IsOptional()
  @IsHexColor()
  @ApiProperty({ example: '#FF5733 ' })
  color?: string;

  @IsOptional()
  @IsEnum(LicenceType)
  @ApiProperty({ enum: LicenceType, default: LicenceType.A })
  licenceType?: LicenceType = null;
}

export class UpdateMainTransportDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1200, type: Number })
  price?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'VW Passat B6', type: String })
  title?: string;

  @IsOptional()
  @IsEnum(RentStatus)
  @ApiProperty({ enum: RentStatus, default: RentStatus.FREE })
  status?: RentStatus;
}

export class UpdateTransportDto {
  @IsOptional()
  @IsObject()
  @ApiProperty({ type: UpdateDescriptionDto })
  description?: UpdateDescriptionDto;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: UpdateMainTransportDto })
  transport?: UpdateMainTransportDto;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '64a3f42b837b437a76e989c5', type: String })
  imageId?: string;
}
