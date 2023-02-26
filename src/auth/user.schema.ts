import { Document, ObjectId } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

import { Role } from './models/role.enum';
import { UserStatus } from './models/user-status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
	status: UserStatus;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('profile', {
	ref: 'Profile',
	localField: '_id',
	foreignField: 'user',
});

export { UserSchema };
