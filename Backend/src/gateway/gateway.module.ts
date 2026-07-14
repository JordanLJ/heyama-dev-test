import { Module } from '@nestjs/common';
import { ObjectsGateway } from './objects.gateway';

@Module({
  providers: [ObjectsGateway],
  exports: [ObjectsGateway],
})
export class GatewayModule {}
