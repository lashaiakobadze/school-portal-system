import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/user.schema';
import { Class, ClassDocument } from 'src/class/class.schema';
import { assignTeacherToClassDto } from './dto/assignTeacherToClass.dto';
import { TeacherDto } from './dto/teacher.dto';
import { TeacherRepository } from './teacher.repository';
import { Teacher } from './teacher.schema';

@Injectable()
export class TeacherService {
	constructor(
		private teacherRepository: TeacherRepository,
		@InjectModel(Class.name) private classModel: Model<ClassDocument>,
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) {}

	async create(
		inputs: TeacherDto,
		teacherUserId: string,
		user: User,
	): Promise<Teacher> {
		// Check if the parent object exists
		const parentExists = await this.userModel.exists({ _id: teacherUserId });

		if (parentExists) {
			// Create a new child object and set the foreign key to the parent object's id
			const dto: TeacherDto = {
				user: teacherUserId,
				creatorId: user._id.toString(),
				...inputs,
			};
	
			return this.teacherRepository.onCreate(dto);
		} else {
			throw new HttpException(
				`Teacher user with id ${teacherUserId} not found`,
				HttpStatus.NOT_FOUND,
			);
		}
	}

	get(id: string): Promise<Teacher> {
		return this.teacherRepository.getById(id);
	}

	getAll(user: User): Promise<Teacher[]> {
		return this.teacherRepository.getAll();
	}

	async update(user: User, inputs: TeacherDto, id: string): Promise<Teacher> {
		let updated: TeacherDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.teacherRepository.onUpdate(id, updated);
	}

	async assignTeacherToClass(user: User, inputs: assignTeacherToClassDto) {
		// Check if the parent object exists
		const parentExists = await this.classModel.exists({ _id: inputs.classId });

		if (parentExists) {
			// Create a new child object and set the foreign key to the parent object's id
			let teacher: Teacher = await this.get(inputs.teacherId);
			teacher.classes.push(inputs.classId);

			return this.teacherRepository.onUpdate(teacher._id.toString(), teacher);
		} else {
			throw new HttpException(
				`Class with id ${inputs.classId} not found`,
				HttpStatus.NOT_FOUND,
			);
		}
	}
}
