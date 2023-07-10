import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService: AuthService

  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req){
    return this.authService.login(req.user);
  }
}
