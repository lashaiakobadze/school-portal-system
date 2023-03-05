import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';

import { User } from 'src/auth/user.schema';
import MongoError from 'src/shared/enums/mongoError.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AcademicYearDto } from './dto/academic-year.dto';
import { AcademicYear, AcademicYearDocument } from './academic-year.schema';

@Injectable()
export class AcademicYearRepository {
	constructor(
		@InjectModel(AcademicYear.name)
		private AcademicYearModel: Model<AcademicYearDocument>,
	) {}

	async onCreate(dto: AcademicYearDto): Promise<AcademicYear> {
		try {
			const newCreated = await new this.AcademicYearModel(dto).save();

			return newCreated;
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				throw new ConflictException('AcademicYear already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
			}
		}
	}

	async onUpdate(id: string, updated: AcademicYearDto): Promise<AcademicYear> {
		try {
			await this.AcademicYearModel.findByIdAndUpdate(id, updated).exec();

			return updated as any;
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				throw new ConflictException('AcademicYear already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
			}
		}
	}

	async getById(id: string): Promise<AcademicYear> {
		try {
			const academicYear: AcademicYear = await this.AcademicYearModel.findById(
				id,
			).exec();

			if (academicYear) {
				return academicYear;
			}

			throw new HttpException(
				'Academic year with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}

	async getAll(user: User): Promise<AcademicYear[]> {
		try {
			let academicYears: AcademicYear[] = await this.AcademicYearModel.find()
			.populate({
				path: 'classes'
			});

			if (!academicYears)
				throw new HttpException(
					'Academic years does not exist',
					HttpStatus.NOT_FOUND,
				);

			return academicYears;
		} catch (error) {
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}
}
