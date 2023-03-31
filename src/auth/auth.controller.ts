import { Body, Controller, Post } from '@nestjs/common';
//import { Request } from 'express';

import AuthService from './auth.service';
import { AuthDto, AuthSigninDto, AuthRefreshDto } from './dto';

@Controller('auth/')
class AuthController {
  constructor(private authService: AuthService) {}

  //First we begin with the customer sign-ups
  @Post('/signup')
  Signup(@Body() dto: AuthDto) {
    console.log(dto);
    return this.authService.signup(dto);
  }

  @Post('/signin')
  SignIn(@Body() dto: AuthSigninDto) {
    return this.authService.signin(dto);
  }

  @Post('/refresh')
  RefreshToken(@Body() dto: AuthRefreshDto) {
    return this.authService.refreshToken(dto);
  }
}

export default AuthController;
