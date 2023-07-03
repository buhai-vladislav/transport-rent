import { Body, Controller, Post, Query, Res } from '@nestjs/common';
import { AuthService } from '../services/Auth';
import { UserService } from '../services/User';
import { SigninDto } from '../dtos/Signin';
import { Response } from 'express';
import { CreateUserDto } from '../dtos/CreateUser';
import { PublicRoute } from '../guards/PublicRoute';
import { TokenService } from '../services/Token';
import { UserDocument } from '../db/schemas/User';
import { TokenPair, ResponseBody, SignInResult } from '../types';

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
  ): Promise<Response<ResponseBody<SignInResult>>> {
    return this.authService.signin(signinDto, res);
  }

  @Post('signup')
  @PublicRoute()
  public async signup(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<UserDocument>>> {
    return this.userService.create(createUserDto, res);
  }

  @Post('logout')
  @PublicRoute()
  public async logout(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<undefined>>> {
    return this.authService.logout(token, res);
  }

  @Post('refresh')
  @PublicRoute()
  public async refresh(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<TokenPair>>> {
    return this.tokenService.getNewTokenPair(token, res);
  }
}
