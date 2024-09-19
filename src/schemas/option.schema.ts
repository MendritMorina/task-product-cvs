import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OptionValues, OptionValuesSchema } from './optionValues.schema';
import {VariantType} from "../enum/variantType.enum";

@Schema()
export class Option {
  @Prop()
  id: string;

  @Prop()
  name: VariantType;

  @Prop()
  dataField: string;

  @Prop({
    type: [OptionValuesSchema],
  })
  values: OptionValues[];
}

export const OptionSchema = SchemaFactory.createForClass(Option);
