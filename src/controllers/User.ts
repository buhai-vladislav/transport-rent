import { Body, Controller, Get, Put, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { UpdateUserDto } from 'src/dtos/UpdateUser';
import { UserService } from 'src/services/User';
import { ResponseBody } from 'src/types/Response';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  public async me(
    @Req() req: any,
    @Res() res: Response,
  ): Promise<Response<ResponseBody>> {
    const id = req?.user?.id;
    return this.userService.findOne({ $and: [{ _id: { $eq: id } }] }, res);
  }

  @Put()
  public async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
    @Res() res: Response,
  ): Promise<Response<ResponseBody>> {
    const id = req?.user?.id;
    return this.userService.updateUser(id, updateUserDto, res);
  }
}
