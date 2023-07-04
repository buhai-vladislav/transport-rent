import { ApiProperty } from '@nestjs/swagger';
import { Base } from './Base';
import { Transport } from './Transport';
import { User } from './User';

export class Rent extends Base {
  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ type: Transport })
  transport: Transport;

  @ApiProperty({
    type: Date,
    description: 'The date that rent is started.',
    example: new Date(),
  })
  fromDate: Date;

  @ApiProperty({
    type: Date,
    required: false,
    description: 'The date that rent will stopped.',
    example: new Date(),
  })
  toDate?: Date;

  @ApiProperty({
    type: Date,
    description: 'The date that rent is stopped.',
    example: new Date(),
  })
  stoppedAt?: Date;
}
