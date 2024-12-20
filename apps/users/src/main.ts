import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '127.0.0.1:5000',
        protoPath: join(__dirname, '../notebook.proto'), // watch at dist folder!!!
        package: 'notebook', // our proto package name
      },
    },
  );

  await app.listen();
}
bootstrap();
