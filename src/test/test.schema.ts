import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { Subject } from 'src/subject/subject.schema';

export type TestDocument = Test & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Test {
	@Transform(value => value.obj._id.toString())
	_id: ObjectId;

	@Prop()
	orderId: number;

	@Prop()
	creatorId: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: Subject.name,
		unique: true,
	})
	@Type(() => Subject)
	subject: Subject;
}

const TestSchema = SchemaFactory.createForClass(Test);

TestSchema.virtual('scores', {
	ref: 'TestScore',
	localField: '_id',
	foreignField: 'test',
});

export { TestSchema };
