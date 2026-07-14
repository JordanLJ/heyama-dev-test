import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppObjectDocument = HydratedDocument<AppObject>;

@Schema({ collection: 'objects' })
export class AppObject {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const AppObjectSchema = SchemaFactory.createForClass(AppObject);
