import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { data, where } = params;
    return this.prisma.user.update({ where, data });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email } });
  }
}
