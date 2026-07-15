import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GatewayModule } from './gateway/gateway.module';
import { HealthController } from './health.controller';
import { ObjectsModule } from './objects/objects.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(
          'MONGODB_URI',
          'mongodb://127.0.0.1:27017/objects',
        ),
        serverSelectionTimeoutMS: 10_000,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    UploadModule,
    GatewayModule,
    ObjectsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
