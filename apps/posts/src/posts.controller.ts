import { Controller } from '@nestjs/common';
import { PostsService } from './posts.service';
import { GrpcMethod } from '@nestjs/microservices';
import { PostsListResponse } from 'proto/notebook';
import { PostResponse } from 'proto/notebook';
import { CreatePostDto } from 'proto/notebook';
import { FindUserRequest } from 'proto/notebook';
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @GrpcMethod('PostService', 'GetPosts')
  async getPosts(): Promise<PostsListResponse> {
    const posts = await this.postsService.getPosts();
    return { posts };
  }

  @GrpcMethod('PostService', 'CreatePost')
  async createPost(
    createPostDto: CreatePostDto,
    findUserRequest: FindUserRequest,
  ): Promise<PostResponse> {
    const { id } = findUserRequest;
    return this.postsService.createPost(id, createPostDto);
  }

  @GrpcMethod('PostService', 'DeletePost')
  async deletePost(findUserRequest: FindUserRequest): Promise<void> {
    const id = findUserRequest.id;
    await this.postsService.deletePost(id);
  }
}
