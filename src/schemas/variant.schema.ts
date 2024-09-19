import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ImageData, ImageSchema } from './image.schema';

@Schema()
export class Variant {
  @Prop()
  id: string;

  @Prop()
  itemId: string;

  @Prop()
  available: string;

  @Prop({
    type: { packaging: { type: String }, description: { type: String } },
  })
  attributes: {
    packaging: string;
    description: string;
  };

  @Prop()
  cost: string;

  @Prop()
  currency: string;

  @Prop()
  depth: number;

  @Prop()
  description: string;

  @Prop()
  dimensionUom: string;

  @Prop()
  height: number;

  @Prop()
  width: number;

  @Prop()
  manufacturerItemCode: string;

  @Prop()
  manufacturerItemId: string;

  @Prop()
  packaging: string;

  @Prop()
  price: string;

  @Prop()
  volume: number;

  @Prop()
  volumeUom: string;

  @Prop()
  weight: number;

  @Prop()
  weightUom: string;

  @Prop()
  optionName: string;

  @Prop()
  optionsPath: string;

  @Prop()
  optionItemsPath: string;

  @Prop()
  sku: string;

  @Prop()
  active: boolean;

  @Prop({
    type: [ImageSchema],
  })
  images: ImageData[];

  @Prop()
  itemCode: string;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
