import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { AcademicYear } from 'src/academic-year/academic-year.schema';

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
	currentStageId: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: AcademicYear.name })
	@Type(() => AcademicYear)
	academicYear: AcademicYear;
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
