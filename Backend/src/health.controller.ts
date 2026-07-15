import { Controller, Get } from '@nestjs/common';
import { S3Service } from './upload/s3.service';

@Controller('health')
export class HealthController {
  constructor(private readonly s3Service: S3Service) {}

  @Get()
  check() {
    return {
      ok: true,
      storage: this.s3Service.getDriver(),
      time: new Date().toISOString(),
    };
  }
}
