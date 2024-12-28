import { Controller } from '@nestjs/common';
import { PostsService } from './posts.service';
import { GrpcMethod } from '@nestjs/microservices';
import { PostsListResponse } from 'proto/notebook';
import { FindUserRequest } from 'proto/notebook';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @GrpcMethod('PostService', 'GetPosts')
  async getPosts(): Promise<PostsListResponse> {
    const posts = await this.postsService.getPosts();
    return { posts };
  }

  @GrpcMethod('PostService', 'CreatePost')
  async createPost(data: { userId: number; title: string; content: string }) {
    console.log('Post Controller data: ', data);
    return this.postsService.createPost(data);
  }

  @GrpcMethod('PostService', 'DeletePost')
  async deletePost(findUserRequest: FindUserRequest): Promise<void> {
    const id = findUserRequest.id;
    await this.postsService.deletePost(id);
  }
}
