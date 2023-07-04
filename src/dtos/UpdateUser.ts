import { IsEmail, IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'John Doe' })
  name?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'eJt6E@example.com' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'password' })
  password?: string;

  @IsString()
  @IsOptional()
  imageId?: string;
}
