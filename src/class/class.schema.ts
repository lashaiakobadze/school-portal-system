import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Class {
	@Transform(value => value.obj._id.toString())
	_id: ObjectId;

	@Prop()
	creatorId: string;

	@Prop()
	class: number;

	@Prop()
	academicYear: string;

	@Prop()
	currentStageId: string;
}

const ClassSchema = SchemaFactory.createForClass(Class);

ClassSchema.virtual('stages', {
	ref: 'Stage',
	localField: '_id',
	foreignField: 'class',
});

ClassSchema.virtual('teachers', {
	ref: 'Teacher',
	localField: '_id',
	foreignField: 'classes',
});

ClassSchema.virtual('students', {
	ref: 'Profile',
	localField: '_id',
	foreignField: 'class',
});

ClassSchema.virtual('subjects', {
	ref: 'Subject',
	localField: '_id',
	foreignField: 'classes',
});

export { ClassSchema };
