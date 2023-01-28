import { Role } from 'src/auth/models/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { User, UserSchema } from 'src/auth/user.schema';

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

	// @CreateDateColumn()
	// createdDate: Date;

	// @UpdateDateColumn()
	// updatedDate: Date;

	// @DeleteDateColumn()
	// deletedDate: Date;

	@Prop({ type: UserSchema,  }) 
	@Type(() => User)
	user: User;

	@Prop()
	roles: Role[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
