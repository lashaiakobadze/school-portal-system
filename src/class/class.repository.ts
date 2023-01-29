import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';

import { User } from 'src/auth/user.schema';
import { ClassDto } from './dto/class.dto';
import MongoError from 'src/utils/mongoError.enum';
import { Class, ClassDocument } from './class.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ClassRepository {
	constructor(
		@InjectModel(Class.name) private classModel: Model<ClassDocument>,
	) {}

	async onCreate(dto: ClassDto): Promise<Class> {
		try {
			const newCreated = new this.classModel({ dto }).save();

			return newCreated;
		} catch (error) {
			// ToDo: improve Error handling
			if (error.code === MongoError.DuplicateKey) {
				throw new ConflictException('Class already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async onUpdate(id: string, updated: ClassDto): Promise<Class> {
		try {
			await this.classModel.findByIdAndUpdate(id, updated).exec();

			return updated as Class;
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				console.log('error', error);
				throw new ConflictException('Class already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async getById(id: string): Promise<Class> {
		try {
			const object: Class = await this.classModel.findById(id).exec();

			if (object) {
				return object;
			}

			throw new HttpException(
				'Profile with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}

	async getAll(user: User): Promise<Class[]> {
		console.log('user', user);

		try {
			let objects: Class[] = await this.classModel.find().populate('stages');

			if (!objects)
				throw new HttpException('Classes does not exist', HttpStatus.NOT_FOUND);

			return objects;
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}
}
