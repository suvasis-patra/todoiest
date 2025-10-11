import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Request,
  Patch,
} from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/user/dto/user.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.registerUser(createUserDto);
    return user;
  }

  @Public()
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
    return { message: 'user logged in!', accessToken };
  }
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Patch('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
    });
    return { message: 'User logged out successfully!' };
  }
}
