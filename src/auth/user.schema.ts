import mongoose, { Document, ObjectId } from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';

import { Role } from './models/role.enum';
import { Status } from './models/user-status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from 'src/profile/profile.schema';

export type UserDocument = User & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
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

	@Prop()
	status: Status;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('profile', {
	ref: 'Profile',
	localField: '_id',
	foreignField: 'user',
});

export { UserSchema };
