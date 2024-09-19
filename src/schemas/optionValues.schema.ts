import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class OptionValues {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  value: string;
}

export const OptionValuesSchema = SchemaFactory.createForClass(OptionValues);
