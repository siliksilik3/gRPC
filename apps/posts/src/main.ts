import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PostsModule } from './posts.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PostsModule,
    {
      transport: Transport.GRPC,
      options: {
        url: 'localhost:5001',
        protoPath: join(__dirname, '../notebook.proto'), // watch at dist folder!!!
        package: 'notebook', // our proto package name
      },
    },
  );
  await app.listen();
}
bootstrap();
