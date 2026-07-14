import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewayModule } from '../gateway/gateway.module';
import { UploadModule } from '../upload/upload.module';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { AppObject, AppObjectSchema } from './schemas/object.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppObject.name, schema: AppObjectSchema },
    ]),
    UploadModule,
    GatewayModule,
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService],
})
export class ObjectsModule {}
