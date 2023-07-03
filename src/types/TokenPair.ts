import { ApiProperty } from '@nestjs/swagger';

class TokenPair {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}

export { TokenPair };
