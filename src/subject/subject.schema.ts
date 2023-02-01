import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

export type SubjectDocument = Subject & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Subject {
	@Transform(value => value.obj._id.toString())
	_id: string;

	@Prop()
	name: string;

	@Prop()
	creatorId: string;

	@Prop()
	level: string;
}

const SubjectSchema = SchemaFactory.createForClass(Subject);

export { SubjectSchema };
