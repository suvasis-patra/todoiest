import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRound);

    const user = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('Unauthorized user!');
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (!isPasswordCorrect) {
        throw new UnauthorizedException('Unauthorized user!');
      } else {
        const payload = { sub: user.id, username: user.username };
        return {
          accessToken: await this.jwtService.signAsync(payload),
        };
      }
    }
  }
}
