import { Body, Controller, Get, Put, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserDocument } from '../db/schemas/User';
import { UpdateUserDto } from '../dtos/UpdateUser';
import { UserService } from '../services/User';
import { ResponseBody } from '../types/Response';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  public async me(
    @Req() req: any,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<UserDocument>>> {
    const id = req?.user?.id;
    return this.userService.findOne({ $and: [{ _id: { $eq: id } }] }, res);
  }

  @Put()
  public async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<UserDocument>>> {
    const id = req?.user?.id;
    return this.userService.updateUser(id, updateUserDto, res);
  }
}
