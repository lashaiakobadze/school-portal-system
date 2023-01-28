import { DataSource, Repository } from 'typeorm';
import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';

import { Class } from './class.entity';
import { User } from 'src/auth/user.schema';
import { ClassDto } from './dto/class.dto';
import MongoError from 'src/utils/mongoError.enum';

@Injectable()
export class ClassRepository extends Repository<Class> {
	constructor(private dataSource: DataSource) {
		super(Class, dataSource.createEntityManager());
	}

	async onCreate(dto: ClassDto): Promise<Class> {
		const newCreated: Class = this.create({
			...dto,
		});

		try {
			await this.save(newCreated);

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

	async onUpdate(updated: Class): Promise<Class> {
		try {
			await this.update(updated._id, updated);

			return updated;
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
			const object: Class = await this.findOneBy({ id });

			if (object) {
				return object;
			}

			throw new HttpException(
				'Class with this id does not exist',
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
			let objects: Class[] = await this.find();

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
