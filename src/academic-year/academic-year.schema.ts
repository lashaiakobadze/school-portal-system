import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { Status } from 'src/shared/enums/status.enum';

export type AcademicYearDocument = AcademicYear & Document;

@Schema({
	toJSON: {
		getters: true,
		virtuals: true,
	},
})
export class AcademicYear {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop({ required: true })
	creatorId: string;

	@Prop({ unique: true })
	academicYearFrom: number;

	@Prop({ unique: true })
	academicYearTo: number;

	@Prop({ required: true })
	status: Status;
}

const AcademicYearSchema = SchemaFactory.createForClass(AcademicYear);

AcademicYearSchema.virtual('academicYear').get(function (this: AcademicYearDocument) {
	return `${this.academicYearFrom}-${this.academicYearTo}`;
});

AcademicYearSchema.virtual('classes', {
	ref: 'Class',
	localField: '_id',
	foreignField: 'academicYear',
});

export { AcademicYearSchema };
