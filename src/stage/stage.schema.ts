import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { Class } from 'src/class/class.schema';

export type StageDocument = Stage & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Stage {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop({ required: true })
	stage: number;

	@Prop({ required: true })
	creatorId: string;

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
