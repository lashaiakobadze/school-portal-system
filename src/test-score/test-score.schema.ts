import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { Profile } from 'src/profile/profile.schema';
import { Test } from 'src/test/test.schema';

export type TestScoreDocument = TestScore & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class TestScore {
	@Transform(value => value.obj._id.toString())
	_id: ObjectId;

	@Prop()
	creatorId: string;

	@Prop()
	score: number;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: Profile.name,
		unique: true,
	})
	@Type(() => Profile)
	profile: Profile;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: Test.name,
		unique: false,
	})
	@Type(() => Test)
	test: Test;
}

const TestScoreSchema = SchemaFactory.createForClass(TestScore);

export { TestScoreSchema };
