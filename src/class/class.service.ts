import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.schema';
import { Class } from './class.entity';
import { ClassRepository } from './class.repository';
import { ClassDto } from './dto/class.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ClassService {
	constructor(private classRepository: ClassRepository) {}

	create(inputs: ClassDto, user: User): Promise<Class> {
		const dto: ClassDto = {
			id: uuid(),
			// creatorId: user._id,
			...inputs,
		};

		return this.classRepository.onCreate(dto);
	}

	get(id: string): Promise<Class> {
		return this.classRepository.getById(id);
	}

	getAll(user: User): Promise<Class[]> {
		return this.classRepository.getAll(user);
	}

	async update(user: User, inputs: ClassDto, id: string): Promise<Class> {
		console.log('user', user);

		let classObject: Class = await this.classRepository.getById(id);

		let updated: Class = {
			...classObject,
			...inputs,
			updatedDate: new Date(),
		};

		return this.classRepository.onUpdate(updated);
	}
}
