import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { User } from 'src/auth/user.schema';

export type TeacherDocument = Teacher & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Teacher {
	@Transform(value => value.obj._id.toString())
	_id: ObjectId;

	@Prop()
	firstName: string;

    @Prop()
	lastName: string;

	@Prop()
	creatorId: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
	@Type(() => User)
	user: User;
}

// const TeacherSchema = SchemaFactory.createForClass(Teacher);

// export { TeacherSchema };

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
