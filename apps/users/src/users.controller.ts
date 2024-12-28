import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  FindUserRequest,
  UserRespone,
  UsersListResponse,
  CreateUserDto,
  Empty,
} from 'proto/notebook';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UserService', 'GetUsers')
  async getUsers(): Promise<UsersListResponse> {
    return this.usersService.getUsers();
  }

  @GrpcMethod('UserService', 'FindUser')
  async findUser(findUserRequest: FindUserRequest): Promise<UserRespone> {
    return this.usersService.findUser(findUserRequest.id);
  }

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(createUserDto: CreateUserDto): Promise<UserRespone> {
    return this.usersService.createUser(createUserDto);
  }

  @GrpcMethod('UserService', 'DeleteUser')
  async deleteUser(findUserRequest: FindUserRequest): Promise<Empty> {
    await this.usersService.deleteUser(findUserRequest.id);
    return {};
  }
}
