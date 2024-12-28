import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePostDto, CreateUserDto } from 'proto/notebook';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getUsers() {
    return this.appService.getUsers();
  }
  @Get('p/:id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.appService.findUser({ id });
  }
  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }
  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteUser({ id });
  }
  //posts
  @Get('posts')
  getPosts() {
    return this.appService.getPosts();
  }
  @Post('create/:id')
  createPost(
    @Param('id', ParseIntPipe) userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    const data = {
      ...createPostDto,
      userId: userId,
    };
    return this.appService.createPost(data);
  }

  @Delete('posts/:id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deletePost({ id });
  }
}
