import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Option, OptionSchema } from './option.schema';
import { ImageData, ImageSchema } from './image.schema';
import { Variant, VariantSchema } from './variant.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class ProductData {
  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  shortDescription: string;

  @Prop()
  description: string;

  @Prop()
  vendorId: string;

  @Prop()
  manufacturerId: string;

  @Prop()
  storefrontPriceVisibility: string;

  @Prop()
  availability: string;

  @Prop()
  isFragile: boolean;

  @Prop()
  published: boolean;

  @Prop()
  isTaxable: boolean;

  @Prop()
  categoryId: string;

  @Prop({ type: [OptionSchema] })
  options: Option[];

  @Prop({
    type: [ImageSchema],
  })
  images: ImageData[];

  @Prop({ type: [VariantSchema] })
  variants: Variant[];

  @Prop()
  deleted: boolean;
}

export const ProductDataSchema = SchemaFactory.createForClass(ProductData);

@Schema()
export class Product {
  @Prop({ unique: true })
  productId: number;

  @Prop()
  docId: string;

  @Prop()
  fullData: string;

  @Prop({ type: ProductDataSchema })
  data: ProductData;

  @Prop({ default: false })
  immutable: boolean;
  deploymentId?: string;

  @Prop({ default: 'item' })
  docType: string;

  @Prop({ default: 'items' })
  namespace: string;

  @Prop()
  companyId?: string;

  @Prop({ default: 'active' })
  soft_delete: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
