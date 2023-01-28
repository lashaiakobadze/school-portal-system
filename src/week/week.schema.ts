import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

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
	homeworkScore: number;

	@Prop()
	onlineTestScore: number;

	@Prop()
	activityScore: number;
}

export const WeekSchema = SchemaFactory.createForClass(Week);
