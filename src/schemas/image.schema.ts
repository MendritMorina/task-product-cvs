import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ImageData {
  @Prop()
  fileName: string;

  @Prop()
  cdnLink?: string;

  @Prop()
  i?: number;

  @Prop()
  alt?: string;
}

export const ImageSchema = SchemaFactory.createForClass(ImageData);
