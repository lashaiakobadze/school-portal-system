import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { User } from 'src/auth/user.schema';

export type ProfileDocument = Profile & Document;

@Schema({
	toJSON: {
		virtuals: true,
	},
})
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

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, unique: true })
	@Type(() => User)
	user: User;
}

const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.virtual('fullName').get(function (this: ProfileDocument) {
	return `${this.firstName} ${this.lastName}`;
});

export { ProfileSchema };
