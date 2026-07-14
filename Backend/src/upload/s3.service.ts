import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);
  private client: S3Client | null = null;
  private driver: 's3' | 'local' = 'local';
  private bucket = 'objects';
  private publicUrl = 'http://localhost:3001/uploads';
  private localDir = path.join(process.cwd(), 'uploads');

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const configured = this.config.get<string>('STORAGE_DRIVER', 'auto');
    this.bucket = this.config.get<string>('S3_BUCKET', 'objects');
    this.publicUrl = this.config.get<string>(
      'S3_PUBLIC_URL',
      'http://localhost:3001/uploads',
    );

    if (configured === 'local') {
      this.driver = 'local';
      await fs.mkdir(this.localDir, { recursive: true });
      this.logger.log('Using local disk storage (uploads/)');
      return;
    }

    const endpoint = this.config.get<string>('S3_ENDPOINT');
    const accessKey = this.config.get<string>('S3_ACCESS_KEY');
    const secretKey = this.config.get<string>('S3_SECRET_KEY');

    if (endpoint && accessKey && secretKey) {
      this.client = new S3Client({
        endpoint,
        region: this.config.get<string>('S3_REGION', 'us-east-1'),
        forcePathStyle: true,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
        },
      });
      this.driver = 's3';
      this.logger.log(`Using S3-compatible storage at ${endpoint}`);
      return;
    }

    this.driver = 'local';
    await fs.mkdir(this.localDir, { recursive: true });
    this.logger.warn(
      'S3 env not set — falling back to local disk storage (uploads/)',
    );
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `objects/${Date.now()}-${safeName}`;

    if (this.driver === 's3' && this.client) {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
      return `${this.publicUrl.replace(/\/$/, '')}/${key}`;
    }

    const dest = path.join(this.localDir, ...key.split('/'));
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, file.buffer);
    return `${this.publicUrl.replace(/\/$/, '')}/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = this.extractKey(fileUrl);
    if (!key) return;

    if (this.driver === 's3' && this.client) {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return;
    }

    const dest = path.join(this.localDir, ...key.split('/'));
    try {
      await fs.unlink(dest);
    } catch {
      this.logger.warn(`Could not delete local file: ${dest}`);
    }
  }

  private extractKey(fileUrl: string): string | null {
    const marker = '/objects/';
    const idx = fileUrl.indexOf(marker);
    if (idx === -1) return null;
    return fileUrl.slice(idx + 1);
  }
}
