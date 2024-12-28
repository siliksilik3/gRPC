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
    const postList = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      user: {
        id: post.user.id, // Используем данные пользователя
        username: post.user.username,
      },
    }));
    return postList;
  }

  async createPost(createPostData: CreatePostDto & { userId: number }) {
    const { userId, title, content } = createPostData;

    // Проверяем существование пользователя
    const userExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error(`User with id: ${userId} doesn't exist`);
    }

    // Создаем новый пост
    const newPost = await this.prisma.post.create({
      data: {
        title,
        content,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: {
          // Включаем данные о пользователе
          select: { id: true, username: true },
        },
      },
    });

    // Возвращаем данные о посте, включая информацию о пользователе
    return {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      userId: newPost.user.id, // Мы можем использовать userId или другие данные о пользователе
      username: newPost.user.username,
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
