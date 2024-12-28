import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'notebook_posts',
        transport: Transport.GRPC,
        options: {
          protoPath: join(__dirname, '../notebook.proto'),
          package: 'notebook',
          url: 'localhost:5002',
        },
      },
      {
        name: 'notebook_users',
        transport: Transport.GRPC,
        options: {
          protoPath: join(__dirname, '../notebook.proto'),
          package: 'notebook',
          url: 'localhost:5001',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
