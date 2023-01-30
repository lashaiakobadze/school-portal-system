import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Class } from 'src/class/class.schema';

export type StageDocument = Stage & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Stage {
	@Transform(value => value.obj._id.toString())
	_id: string;

	@Prop()
	stage: number;

	@Prop()
	creatorId: string;

	@Prop()
	currentWeekId: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: Class.name })
	@Type(() => Class)
	class: Class;
}

const StageSchema = SchemaFactory.createForClass(Stage);

StageSchema.virtual('weeks', {
	ref: 'Week',
	localField: '_id',
	foreignField: 'stage',
});

export { StageSchema };
