import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;


  @Prop({ default: Date.now })
  createdAt: Date;


}


export const UserSchema = SchemaFactory.createForClass(User);
