import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { Class } from 'src/class/class.schema';
import { Status } from 'src/utils/status.enum';

export type SubjectDocument = Subject & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Subject {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	creatorId: string;
	
	@Prop({ required: true})
	status: Status;

	@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Class.name, unique: true }])
	@Type(() => Class)
	classes: Class[];
}

const SubjectSchema = SchemaFactory.createForClass(Subject);

SubjectSchema.virtual('tests', {
	ref: 'Test',
	localField: '_id',
	foreignField: 'subject',
});

export { SubjectSchema };
