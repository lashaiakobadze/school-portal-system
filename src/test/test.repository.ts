import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from 'src/auth/user.schema';
import MongoError from 'src/shared/enums/mongoError.enum';
import { Status } from 'src/shared/enums/status.enum';
import { TestDto } from './dto/test.dto';
import { Test, TestDocument } from './test.schema';

@Injectable()
export class TestRepository {
	constructor(@InjectModel(Test.name) private testModel: Model<TestDocument>) {}

	async onCreate(dto: TestDto): Promise<Test> {
		try {
			const newCreated = await new this.testModel(dto).save();

			return newCreated;
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				throw new ConflictException('Test already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
			}
		}
	}

	async onUpdate(id: string, updated: TestDto): Promise<Test> {
		try {
			await this.testModel.findByIdAndUpdate(id, updated).exec();

			return updated as any; // Todo: fix all this any case, around of project.
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				console.log('error', error);
				throw new ConflictException('Test already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
			}
		}
	}

	async getById(id: string): Promise<Test> {
		try {
			const object: Test = await this.testModel.findById(id);

			if (object) {
				return object;
			}

			throw new HttpException(
				'Test with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}

	async getAll(user: User): Promise<Test[]> {
		try {
			const filters: FilterQuery<TestDocument> = {
				status: Status.ACTIVE,
			};

			let objects: Test[] = await this.testModel
				.find(filters)
				.populate('scores');

			if (!objects)
				throw new HttpException('Tests does not exist', HttpStatus.NOT_FOUND);

			return objects;
		} catch (error) {
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}
}
