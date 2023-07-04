import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/Auth';
import { UserService } from '../services/User';
import { SigninDto } from '../dtos/Signin';
import { Request, Response } from 'express';
import { CreateUserDto } from '../dtos/CreateUser';
import { PublicRoute } from '../guards/PublicRoute';
import { TokenService } from '../services/Token';
import { UserDocument } from '../db/schemas/User';
import { TokenPair, ResponseBody, SignInResult } from '../types';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../decorators/ApiOkResponse';
import { ApiErrorResponse } from '../decorators/ApiErrorResponse';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @ApiOperation({ summary: 'Sign in flow process.' })
  @ApiSuccessResponse(
    SignInResult,
    'The user successfully logged in',
    HttpStatus.OK,
  )
  @ApiErrorResponse(
    String,
    "The user wasn't logged in.",
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(
    String,
    "The user wasn't logged in.",
    HttpStatus.UNAUTHORIZED,
  )
  @ApiBody({ type: CreateUserDto })
  @Post('signin')
  @PublicRoute()
  public async signin(
    @Body() signinDto: SigninDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response<ResponseBody<SignInResult>>> {
    return this.authService.signin(signinDto, res, req);
  }

  @ApiOperation({ summary: 'Sign up flow process.' })
  @ApiSuccessResponse(
    CreateUserDto,
    'The user successfully signed up.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(
    String,
    "The user wasn't signed up.",
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBody({ type: CreateUserDto })
  @Post('signup')
  @PublicRoute()
  public async signup(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response<ResponseBody<UserDocument>>> {
    return this.userService.create(createUserDto, res, req);
  }

  @ApiOperation({ summary: 'The logout flow process.' })
  @ApiSuccessResponse(
    String,
    'The user successfully logged out.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(
    String,
    "The user wasn't logged out.",
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Invalid token.', HttpStatus.BAD_REQUEST)
  @ApiQuery({ name: 'token', required: true })
  @Post('logout')
  @PublicRoute()
  public async logout(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<undefined>>> {
    return this.authService.logout(token, res);
  }

  @ApiOperation({ summary: 'The refreshing token pair flow process.' })
  @ApiSuccessResponse(
    String,
    'The token pair successfully refreshed.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(
    String,
    "The token pair wasn't refreshed.",
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Invalid token.', HttpStatus.BAD_REQUEST)
  @ApiQuery({ name: 'token', required: true })
  @Post('refresh')
  @PublicRoute()
  public async refresh(
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<Response<ResponseBody<TokenPair>>> {
    return this.tokenService.getNewTokenPair(token, res);
  }
}
