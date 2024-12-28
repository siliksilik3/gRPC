import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateUserDto,
  FindPostRequest,
  FindUserRequest,
  POST_SERVICE_NAME,
  PostServiceClient,
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'proto/notebook';

@Injectable()
export class AppService implements OnModuleInit {
  private userServiceClient: UserServiceClient;
  private postServiceClient: PostServiceClient;

  constructor(
    @Inject('notebook_users') private clientGrpcUser: ClientGrpc,
    @Inject('notebook_posts') private clientGrpcPost: ClientGrpc,
  ) {}

  onModuleInit() {
    // Получаем сервисы через клиент gRPC
    this.userServiceClient =
      this.clientGrpcUser.getService<UserServiceClient>(USER_SERVICE_NAME);
    this.postServiceClient =
      this.clientGrpcPost.getService<PostServiceClient>(POST_SERVICE_NAME);
  }

  getUsers() {
    return this.userServiceClient.getUsers({});
  }
  findUser(findUserRequest: FindUserRequest) {
    return this.userServiceClient.findUser(findUserRequest);
  }

  createUser(createUserDto: CreateUserDto) {
    return this.userServiceClient.createUser(createUserDto);
  }

  deleteUser(findUserRequest: FindUserRequest) {
    return this.userServiceClient.deleteUser(findUserRequest);
  }
  //posts
  getPosts() {
    return this.postServiceClient.getPosts({});
  }

  createPost(data: { userId: number; title: string; content: string }) {
    console.log('POST DATA: ', data);
    return this.postServiceClient.createPost(data);
  }

  deletePost(findPostRequest: FindPostRequest) {
    return this.postServiceClient.deletePost(findPostRequest);
  }
}
