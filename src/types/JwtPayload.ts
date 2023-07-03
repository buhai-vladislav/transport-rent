import { ApiProperty } from '@nestjs/swagger';

class JwtPayload {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
}

export { JwtPayload };
