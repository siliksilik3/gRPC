import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  POST_SERVICE_NAME,
  PostServiceClient,
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'proto/notebook';

@Injectable()
export class AppService implements OnModuleInit {
  private userServiceClient: UserServiceClient;

  constructor(@Inject('notebook') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    // Получаем сервисы через клиент gRPC
    this.userServiceClient =
      this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  // Метод для получения пользователей
  async getUsers() {
    return this.userServiceClient.getUsers({});
  }
}
