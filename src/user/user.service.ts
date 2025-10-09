import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      const DUPLICATE_KEY_CODE = 'P2002';
      const err: {
        code?: string;
        meta?: { modelName: string; target: string[] };
      } = error;
      if (
        err.code === DUPLICATE_KEY_CODE &&
        err.meta?.target.includes('email')
      ) {
        throw new ConflictException('Email already exist!');
      } else {
        throw new InternalServerErrorException(
          'Something went wrong. Try again!',
        );
      }
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { data, where } = params;
    return await this.prisma.user.update({ where, data });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { email } });
  }
}
