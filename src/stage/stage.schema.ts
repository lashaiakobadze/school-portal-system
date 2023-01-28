import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

export type StageDocument = Stage & Document;

@Schema()
export class Stage {
	@Transform(value => value.obj._id.toString())
	_id: string;

	@Prop()
	stage: number;

	@Prop()
	currentWeekId: string;

	@Prop()
	weeks: string[];
}

export const StageSchema = SchemaFactory.createForClass(Stage);
