import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.schema';
import { ClassRepository } from './class.repository';
import { ClassDto } from './dto/class.dto';
import { Class } from './class.schema';
import { assignClassToAcademicYearDto } from './dto/assignClassToAcademicYear.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject } from 'rxjs';
import {
	AcademicYear,
	AcademicYearDocument,
} from 'src/academic-year/academic-year.schema';

@Injectable()
export class ClassService {
	constructor(
		private classRepository: ClassRepository,
		@InjectModel(AcademicYear.name)
		private AcademicYearModel: Model<AcademicYearDocument>,
	) {}

	create(inputs: ClassDto, user: User): Promise<Class> {
		const dto: ClassDto = {
			creatorId: user._id.toString(),
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
		let updated: ClassDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.classRepository.onUpdate(id, updated);
	}

	async assignToAcademicYear(user: User, inputs: assignClassToAcademicYearDto) {
		// Check if the parent object exists
		const parentExists = await this.AcademicYearModel.exists({ _id: inputs.academicYearId });

		if (parentExists) {
			// Create a new child object and set the foreign key to the parent object's id
			let classObj: Class = await this.get(inputs.classId);
			classObj.academicYear = inputs.academicYearId;

			return this.classRepository.onUpdate(classObj._id.toString(), classObj);
		} else {
			throw new HttpException(
				`Academic year with id ${inputs.classId} not found`,
				HttpStatus.NOT_FOUND,
			);
		}
	}
}
