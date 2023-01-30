import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { Stage } from 'src/stage/stage.schema';

export type WeekDocument = Week & Document;

@Schema()
export class Week {
	@Transform(value => value.obj._id.toString())
	_id: ObjectId;

    @Prop()
	creatorId: string;

	@Prop()
	testScore: number;

	@Prop()
	week: number;

	@Prop()
	homeworkScore: number;

	@Prop()
	onlineTestScore: number;

	@Prop()
	activityScore: number;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Stage.name })
	@Type(() => Stage)
	stage: Stage;
}

export const WeekSchema = SchemaFactory.createForClass(Week);
