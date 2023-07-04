import { ApiProperty } from '@nestjs/swagger';
import { Base } from './Base';
import { TransportType } from 'src/db/schemas/Transport';
import { LicenceType } from 'src/db/schemas/Transport';
import { RentStatus } from 'src/db/schemas/Transport';

class Description extends Base {
  @ApiProperty({ example: 'Car', type: String })
  description: string;

  @ApiProperty({ example: 120, type: Number })
  maxSpeed: number;

  @ApiProperty({ enum: TransportType, default: TransportType.CAR })
  type: TransportType;

  @ApiProperty({ example: 1200, type: Number })
  weight: number;

  @ApiProperty({ example: 1200, type: Number })
  seats: number;

  @ApiProperty({ example: 1200, type: Number })
  power: number;

  @ApiProperty({ example: 1200, type: Number })
  color: string;

  @ApiProperty({
    enum: LicenceType,
    default: LicenceType.A,
    example: LicenceType.A,
  })
  licenceType?: LicenceType;
}

export class Transport extends Base {
  @ApiProperty({ example: 1200, type: Number })
  price: number;

  @ApiProperty({ example: 'VW Passat B6', type: String })
  title: string;

  @ApiProperty({ type: Description })
  description: Description;

  @ApiProperty({
    enum: RentStatus,
    default: RentStatus.FREE,
    example: RentStatus.FREE,
  })
  status: RentStatus;
}
