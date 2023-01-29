import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { Stage } from 'src/stage/stage.schema';

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

	@Prop()
	subjects: string[];

	@Prop()
	teachers: string;

	@Prop()
	students: string;
}

const ClassSchema = SchemaFactory.createForClass(Class);

ClassSchema.virtual('stages', {
	ref: 'Stage',
	localField: '_id',
	foreignField: 'class',
});

export { ClassSchema };
