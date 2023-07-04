import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserDocument } from '../db/schemas/User';
import { UpdateUserDto } from '../dtos/UpdateUser';
import { UserService } from '../services/User';
import { ResponseBody } from '../types/Response';
import { User } from '../types/User';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse, ApiSuccessResponse } from '../decorators';
import { JWT_BEARER_SWAGGER_AUTH_NAME } from '../utils/constants';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Fetching self process.' })
  @ApiSuccessResponse(User, 'The user successfully retrieved.', HttpStatus.OK)
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Get('me')
  public async me(
    @Req() req: any,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<UserDocument>>> {
    const id = req?.user?.id;
    return this.userService.findOne({ $and: [{ _id: { $eq: id } }] }, res, req);
  }

  @ApiOperation({ summary: 'Update self process.' })
  @ApiSuccessResponse(User, 'The user successfully updated.', HttpStatus.OK)
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Put()
  public async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<UserDocument>>> {
    const id = req?.user?.id;
    return this.userService.updateUser(id, updateUserDto, res, req);
  }
}
