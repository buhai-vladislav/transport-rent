import { ApiProperty } from '@nestjs/swagger';
import { Schema } from 'mongoose';

export class Base {
  @ApiProperty({
    type: Schema.Types.ObjectId,
    required: true,
    example: '64a3f42b837b437a76e989c5',
  })
  _id: string;

  @ApiProperty({
    type: Date,
    required: true,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    required: true,
    example: new Date(),
  })
  updatedAt: Date;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
  })
  _v: number;
}
