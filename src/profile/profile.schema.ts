import { Role } from 'src/auth/models/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { User } from 'src/auth/user.schema';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
	@Transform(value => value.obj._id.toString())
	_id: ObjectId;

	@Prop({ unique: true })
	personalNumber: number;

	@Prop()
	phoneNumber: string;

	@Prop()
	firstName: string;

	@Prop()
	lastName: string;

	@Prop({ unique: true })
	email: string;

	@Prop()
	profileImg: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
	@Type(() => User)
	user: User;

	@Prop()
	roles: Role[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
