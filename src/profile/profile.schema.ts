import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId } from 'mongoose';
import { User } from 'src/auth/user.schema';
import { Class } from 'src/class/class.schema';
import { PublicFile } from 'src/public-file/public-file.schema';

export type ProfileDocument = Profile & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class Profile {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop({
		// ToDo: fix this pipe.
		get: (personalNumber: string) => {
			if (!personalNumber) {
				return;
			}
			return `ID ${personalNumber}`;
		},
		unique: true,
	})
	personalNumber: number;

	@Prop({ required: true })
	phoneNumber: string;

	@Prop({
		required: true,
		set: (content: string) => {
			return content.trim();
		},
		// index: true, // secondary indexes that don’t make properties unique.
	})
	firstName: string;

	@Prop({
		set: (content: string) => {
			return content.trim();
		},
		// index: true, // secondary indexes that don’t make properties unique
	})
	lastName: string;

	@Prop({ unique: true, required: true })
	email: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, unique: true })
	@Type(() => User)
	user: User;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: Class.name,
		unique: false,
	})
	@Type(() => Class)
	class?: Class;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: PublicFile.name,
		unique: false,
	})
	@Type(() => PublicFile)
	public avatar?: PublicFile;
}

const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.virtual('fullName').get(function (this: ProfileDocument) {
	return `${this.firstName} ${this.lastName}`;
});

/**
 * When we set up a text index, we can take advantage of the $text operator.
 * It performs a text search on the content of the fields indexed with a text index.
 * A collection can’t have more than one text index.
 */
ProfileSchema.index({ firstName: 'text' });

/**
 * Compound Indexes: where the index structure holds references to multiple fields.
 */
// ProfileSchema.index({ firstName: 'text', lastName: 'text' });

/**
 * By using 1, we create an ascending index.
 * When we use -1, we create a descending index.
 * The direction doesn’t matter for single key indexes because MongoDB can traverse the index in either direction.
 * It can be significant for compound indexes, though.
 * The official documentation: https://www.mongodb.com/docs/manual/core/index-compound/#sort-order
 * StackOverflow page provide a good explanation: https://stackoverflow.com/questions/10329104/why-does-direction-of-index-matter-in-mongodb
 * Default: The @Prop({ index: true }) decorator creates an ascending index
 */
// ProfileSchema.index({ firstName: 1, lastName: 1 });

export { ProfileSchema };
