import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.module';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    // Получаем пользователей из базы данных
    const users = await this.prisma.user.findMany();

    // Маппим их в формат, необходимый для gRPC
    const usersList = users.map((user) => ({
      id: user.id,
      username: user.username,
    }));

    return { users: usersList };
  }

  async createUser(data: Prisma.UserCreateInput) {
    const isExist = await this.prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });
    if (isExist)
      throw new HttpException(`User with name: ${data.username} exist`, 400);
    return this.prisma.user.create({ data });
  }

  async findUser(id: number) {
    const found = await this.prisma.user.findUnique({ where: { id } });
    if (!found)
      throw new HttpException(`User with id: ${id} doesn't exist`, 404);
    return found;
  }

  async deleteUser(id: number) {
    await this.findUser(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
