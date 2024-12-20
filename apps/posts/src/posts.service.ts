import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dtos/CreatePost.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getPosts() {
    // Включаем информацию о пользователе для каждого поста
    const posts = await this.prisma.post.findMany({
      include: {
        user: {
          select: { id: true, username: true }, // Загружаем только id и username пользователя
        },
      },
    });

    // Преобразуем результат в нужный формат, который ожидает gRPC
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      user: {
        id: post.user.id,
        username: post.user.username, // Используем данные пользователя
      },
    }));
  }

  async createPost(id: number, data: CreatePostDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!userExists) {
      throw new HttpException(`User with id: ${id} doesn't exist`, 404);
    }

    const newPost = await this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        user: {
          connect: { id }, // связываем пост с пользователем
        },
      },
      include: {
        user: {
          select: { id: true, username: true }, // Получаем пользователя с id и username
        },
      },
    });

    // Формируем объект для ответа, соответствующий типу PostResponse
    return {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      user: {
        id: newPost.user.id,
        username: newPost.user.username,
      },
    };
  }

  async deletePost(id: number) {
    const postExists = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!postExists) {
      throw new HttpException(`Post with id: ${id} doesn't exist`, 404);
    }
    return this.prisma.post.delete({ where: { id } });
  }
}
