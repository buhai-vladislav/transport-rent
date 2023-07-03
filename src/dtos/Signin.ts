import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'User email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'User password' })
  password: string;
}
