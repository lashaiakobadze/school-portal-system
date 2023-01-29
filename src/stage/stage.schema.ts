import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Class } from 'src/class/class.schema';

export type StageDocument = Stage & Document;

@Schema()
export class Stage {
	@Transform(value => value.obj._id.toString())
	_id: string;

	@Prop()
	stage: number;

	@Prop()
	creatorId: string;

	@Prop()
	currentWeekId: string;

	// @Prop()
	// weeks: string[];

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Class.name })
	@Type(() => Class)
	class: Class;
}

export const StageSchema = SchemaFactory.createForClass(Stage);
