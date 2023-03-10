import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { Status } from 'src/shared/enums/status.enum';
import { Subject } from 'src/subject/subject.schema';

export type TestDocument = Test & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Test {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop({ required: true })
	orderId: number;

	@Prop({ required: true })
	creatorId: string;
	
	@Prop({ required: true})
	status: Status;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: Subject.name
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
