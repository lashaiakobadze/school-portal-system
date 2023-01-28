import mongoose, { Document, ObjectId } from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';

import { Role } from './models/role.enum';
import { Status } from './models/user-status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from 'src/profile/profile.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  username: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  @Exclude()
  passwordConfirm: string;

  @Prop()
  creatorId: string;

  @Prop()
  roles?: Role[];

  @Prop()
  @Exclude()
  public currentHashedRefreshToken?: string;

  // @CreateDateColumn()
  // createdDate: Date;

  // @UpdateDateColumn()
  // updatedDate: Date;

  // @DeleteDateColumn()
  // deletedDate: Date;

  @Prop() 
  status: Status;
}

export const UserSchema = SchemaFactory.createForClass(User);

