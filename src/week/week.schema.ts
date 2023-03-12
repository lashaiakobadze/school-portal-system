import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { Status } from 'src/shared/enums/status.enum';
import { Stage } from 'src/stage/stage.schema';
import { Test } from 'src/test/test.schema';

export type WeekDocument = Week & Document;

@Schema()
export class Week {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop({ required: true })
	creatorId: string;

	@Prop({ required: true })
	weekOrder: number;

	@Prop({ required: true })
	status: Status;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Stage.name })
	@Type(() => Stage)
	stage: Stage;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Test.name })
	@Type(() => Test)
	test: Test;
}

export const WeekSchema = SchemaFactory.createForClass(Week);
