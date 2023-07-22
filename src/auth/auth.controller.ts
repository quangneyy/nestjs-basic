import { RegisterUserDto } from './../users/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage } from './../decorator/customize';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService

  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage("User Login")
  handleLogin(@Request() req){
    return this.authService.login(req.user);
  }

  @Public()
  @ResponseMessage("Register a new user")
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
