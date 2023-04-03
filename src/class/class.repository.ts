import {
	CACHE_MANAGER,
	ConflictException,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
} from '@nestjs/common';

import { User } from 'src/auth/user.schema';
import { ClassDto } from './dto/class.dto';
import MongoError from 'src/shared/enums/mongoError.enum';
import { Class, ClassDocument } from './class.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GET_CLASSES_CACHE_KEY } from './models/classCacheKey.constant';
import { Cache } from 'cache-manager';
@Injectable()
export class ClassRepository {
	constructor(
		@InjectModel(Class.name) private classModel: Model<ClassDocument>,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	async clearCache() {
		const keys: string[] = await this.cacheManager.store.keys();
		keys.forEach(key => {
			if (key.startsWith(GET_CLASSES_CACHE_KEY)) {
				this.cacheManager.del(key);
			}
		});
	}

	async onCreate(dto: ClassDto): Promise<Class> {
		try {
			const newCreated = await new this.classModel(dto).save();
			await this.clearCache();

			return newCreated;
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				throw new ConflictException('Class already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
			}
		}
	}

	async onUpdate(id: string, updated: ClassDto): Promise<Class> {
		try {
			await this.classModel.findByIdAndUpdate(id, updated).exec();
			await this.clearCache();

			return updated as any;
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				console.log('error', error);
				throw new ConflictException('Class already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
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
				'class with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}

	async getAll(user: User): Promise<Class[]> {
		try {
			let objects: Class[] = await this.classModel
				.find()
				.populate({
					path: 'stages',
					populate: {
						path: 'weeks',
						populate: {
							path: 'test',
							populate: {
								path: 'scores',
							},
						},
					},
				})
				.populate({
					path: 'subjects',
					populate: {
						path: 'tests',
						populate: {
							path: 'scores',
						},
					},
				})
				.populate('teachers')
				.populate('students');

			if (!objects)
				throw new HttpException('Classes does not exist', HttpStatus.NOT_FOUND);

			return objects;
		} catch (error) {
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}
}
