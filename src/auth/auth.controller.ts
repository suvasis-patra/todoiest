import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.registerUser(createUserDto);
    console.log('USER :', user);
    return user;
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.loginUser(loginUserDto);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
    });
    return { message: 'user logged in!' };
  }
}
