import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export type SubjectDocument = Subject & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Subject {
	@Transform(value => value.obj._id.toString())
	_id: ObjectId;

	@Prop()
	name: string;

	@Prop()
	creatorId: string;

	@Prop()
	level: string;
}

const SubjectSchema = SchemaFactory.createForClass(Subject);

export { SubjectSchema };
