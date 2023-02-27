import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { User } from 'src/auth/user.schema';
import { Class } from 'src/class/class.schema';

export type TeacherDocument = Teacher & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Teacher {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop({ required: true })
	firstName: string;

	@Prop({ required: true })
	lastName: string;

	@Prop({ required: true })
	creatorId: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, unique: true })
	@Type(() => User)
	user: User;

	@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Class.name, unique: true }])
	@Type(() => Class)
	classes: Class[];
}

const TeacherSchema = SchemaFactory.createForClass(Teacher);

export { TeacherSchema };