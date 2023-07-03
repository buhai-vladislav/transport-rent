import { Body, Controller, Post, Query, Res } from '@nestjs/common';
import { AuthService } from '../services/Auth';
import { UserService } from '../services/User';
import { SigninDto } from '../dtos/Signin';
import { Response } from 'express';
import { CreateUserDto } from 'src/dtos/CreateUser';
import { PublicRoute } from 'src/guards/PublicRoute';
import { TokenService } from 'src/services/Token';
import { ResponseBody } from 'src/types/Response';

@Controller('auth')
export class AuthCotroller {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('signin')
  @PublicRoute()
  public async signin(
    @Body() signinDto: SigninDto,
    @Res() res: Response,
  ): Promise<Response<ResponseBody>> {
    return this.authService.signin(signinDto, res);
  }

  @Post('signup')
  @PublicRoute()
  public async signup(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response<ResponseBody>> {
    return this.userService.create(createUserDto, res);
  }

  @Post('logout')
  @PublicRoute()
  public async logout(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<Response<ResponseBody>> {
    return this.authService.logout(token, res);
  }

  @Post('refresh')
  @PublicRoute()
  public async refresh(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<Response<ResponseBody>> {
    return this.tokenService.getNewTokenPair(token, res);
  }
}
