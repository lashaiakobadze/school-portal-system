import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.schema';
import MongoError from 'src/utils/mongoError.enum';
import { SubjectDto } from './dto/subject.dto';
import { Subject, SubjectDocument } from './subject.schema';

@Injectable()
export class SubjectRepository {
    constructor(
		@InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
	) {}

	async onCreate(dto: SubjectDto): Promise<Subject> {
		try {
			const newCreated = await new this.subjectModel(dto).save();

			return newCreated;
		} catch (error) {
			// ToDo: improve Error handling
			if (error.code === MongoError.DuplicateKey) {
				throw new ConflictException('Subject already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async onUpdate(id: string, updated: SubjectDto): Promise<Subject> {
		try {
			await this.subjectModel.findByIdAndUpdate(id, updated).exec();

			return updated as any; // Todo: fix all this any case, around of project.
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				console.log('error', error);
				throw new ConflictException('Subject already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async getById(id: string): Promise<Subject> {
		try {
			const object: Subject = await this.subjectModel.findById(id).exec();

			if (object) {
				return object;
			}

			throw new HttpException(
				'Subject with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}

	async getAll(user: User): Promise<Subject[]> {
		console.log('user', user);

		try {
			let objects: Subject[] = await this.subjectModel.find().populate('');

			if (!objects)
				throw new HttpException('Subjects does not exist', HttpStatus.NOT_FOUND);

			return objects;
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}
}
