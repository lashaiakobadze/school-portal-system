import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export type PublicFileDocument = PublicFile & Document;

@Schema()
export class PublicFile {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop({ required: true })
	public key: string;

	@Prop({ required: true })
	public url: string;
}

const PublicFileSchema = SchemaFactory.createForClass(PublicFile);

export { PublicFileSchema };
