import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { Stage } from 'src/stage/stage.schema';
import { Status } from 'src/utils/status.enum';

export type WeekDocument = Week & Document;

@Schema()
export class Week {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop({ required: true })
	creatorId: string;

	@Prop({ required: true })
	weekOrder: number;

	@Prop({ required: true})
	status: Status;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Stage.name })
	@Type(() => Stage)
	stage: Stage;
}

export const WeekSchema = SchemaFactory.createForClass(Week);
