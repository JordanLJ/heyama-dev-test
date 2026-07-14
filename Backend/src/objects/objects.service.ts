import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectsGateway } from '../gateway/objects.gateway';
import { S3Service } from '../upload/s3.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { AppObject, AppObjectDocument } from './schemas/object.schema';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(AppObject.name)
    private readonly objectModel: Model<AppObjectDocument>,
    private readonly s3Service: S3Service,
    private readonly objectsGateway: ObjectsGateway,
  ) {}

  async create(dto: CreateObjectDto, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image file is required (field: image)');
    }

    const imageUrl = await this.s3Service.uploadFile(file);
    const created = await this.objectModel.create({
      title: dto.title,
      description: dto.description,
      imageUrl,
    });

    this.objectsGateway.emitObjectCreated(created);
    return created;
  }

  async findAll() {
    return this.objectModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const obj = await this.objectModel.findById(id).exec();
    if (!obj) {
      throw new NotFoundException(`Object ${id} not found`);
    }
    return obj;
  }

  async remove(id: string) {
    const obj = await this.findOne(id);
    await this.s3Service.deleteFile(obj.imageUrl);
    await this.objectModel.deleteOne({ _id: id }).exec();
    this.objectsGateway.emitObjectDeleted({ id });
    return { deleted: true, id };
  }
}
