import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../db/schemas/User';
import { Base } from './Base';
import { File } from './File';

export class User extends Base {
  @ApiProperty({ example: 'John Doe', type: String })
  name: string;

  @ApiProperty({ example: 'eJt6E@example.com', type: String })
  email: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty({ type: File, required: false })
  image?: File;
}
