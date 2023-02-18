import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.schema';
import MongoError from 'src/utils/mongoError.enum';
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
			// ToDo: improve Error handling
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
			const object: Test = await this.testModel.findById(id).exec();

			if (object) {
				return object;
			}

			throw new HttpException(
				'Test with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}

	async getAll(user: User): Promise<Test[]> {
		try {
			let objects: Test[] = await this.testModel.find().populate('');

			if (!objects)
				throw new HttpException('Tests does not exist', HttpStatus.NOT_FOUND);

			return objects;
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}
}
