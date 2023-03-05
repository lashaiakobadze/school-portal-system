import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import MongoError from 'src/shared/enums/mongoError.enum';
import { TeacherDto } from './dto/teacher.dto';
import { Teacher, TeacherDocument } from './teacher.schema';

@Injectable()
export class TeacherRepository {
	constructor(
		@InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
	) {}

	async onCreate(dto: TeacherDto): Promise<Teacher> {
		try {
			const newCreated = await new this.teacherModel(dto).save();

			return newCreated;
		} catch (error) {			
			if (error.code === MongoError.DuplicateKey) {
				throw new ConflictException('Teacher already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
			}
		}
	}

	async onUpdate(id: string, updated: TeacherDto): Promise<Teacher> {
		try {
			await this.teacherModel.findByIdAndUpdate(id, updated).exec();

			return updated as any; // Todo: fix all this any case, around of project.
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				console.log('error', error);
				throw new ConflictException('Teacher already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
			}
		}
	}

	async getById(id: string): Promise<Teacher> {
		try {
			const object: Teacher = await this.teacherModel.findById(id);

			if (object) {
				return object;
			}

			throw new HttpException(
				'Teacher with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {			
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}

	async getAll(): Promise<Teacher[]> {
		try {
			let objects: Teacher[] = await this.teacherModel
				.find()
				.populate('user')
				.populate('classes');

			if (!objects)
				throw new HttpException(
					'Teachers does not exist',
					HttpStatus.NOT_FOUND,
				);

			return objects;
		} catch (error) {			
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}
}
