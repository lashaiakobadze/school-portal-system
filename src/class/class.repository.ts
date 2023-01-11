import { DataSource, Repository } from 'typeorm';
import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable, InternalServerErrorException,
} from '@nestjs/common';

import { Class } from './class.entity';
import { User } from 'src/auth/user.entity';
import { ClassDto } from './dto/class.dto';

@Injectable()
export class ClassRepository extends Repository<Class> {
	constructor(private dataSource: DataSource) {
		super(Class, dataSource.createEntityManager());
	}

	async createClass(classDto: ClassDto): Promise<Class> {
		const classObject: Class = this.create({
			...classDto,
		});

		try {
			await this.save(classObject);

			return classObject;
		} catch (error) {
			// ToDo: improve Error handling
			if (error.code === 11000) {
				throw new ConflictException('Class already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async updateClass(classObject: Class): Promise<Class> {
		try {
			await this.update(classObject._id, classObject);

			return classObject;
		} catch (error) {
			if (error.code === 11000) {
				console.log('error', error);
				throw new ConflictException('Class already exists');
			} else {
				console.log('error', error);
				throw new InternalServerErrorException();
			}
		}
	}

	async getClassById(classId: string): Promise<Class> {
		try {
			const classObject = await this.findOneBy({ id: classId });

			if (classObject) {
				return classObject;
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

	async getClasses(user: User): Promise<Class[]> {
		try {
			let classes: Class[] = await this.find();

			throw new HttpException('Classes does not exist', HttpStatus.NOT_FOUND);
		} catch (error) {
			// ToDo: improve Error handling
			console.log('error', error);
			throw new InternalServerErrorException();
		}
	}
}
