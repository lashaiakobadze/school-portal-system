import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export type ClassDocument = Class & Document;

@Schema()
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
	stages: string[];

    @Prop()
	subjects: string[];

    @Prop()
	teachers: string;

    @Prop()
	students: string;
}

export const ClassSchema = SchemaFactory.createForClass(Class);

