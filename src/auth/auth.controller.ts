import { IUser } from './../users/users.interface';
import { RegisterUserDto } from './../users/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from './../decorator/customize';
import { AuthService } from './auth.service';
import { Body, Controller, Post, Res, Req, UseGuards, Get } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService

  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage("User Login")
  handleLogin(
    @Req() req, 
    @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage("Register a new user")
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage("Get user information")
  @Get('/account')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @ResponseMessage("Get User by refresh token")
  @Get('/refresh')
  handleRefreshToken(@Req() request: Request) {
    const refreshToken = request.cookies["refresh_token"];

    return this.authService.processNewToken(refreshToken);
  }
}
