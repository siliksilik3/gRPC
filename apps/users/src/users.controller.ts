import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersListResponse } from 'proto/notebook';
import { UserRespone } from 'proto/notebook';
import { CreateUserDto } from 'proto/notebook';
import { FindUserRequest } from 'proto/notebook';

@Controller('users')
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
  async deleteUser(findUserRequest: FindUserRequest): Promise<void> {
    await this.usersService.deleteUser(findUserRequest.id);
  }
}
