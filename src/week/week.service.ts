import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.schema';
import { WeekDto } from './dto/week.dto';
import { Week } from './week.schema';
import { WeekRepository } from './week.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Stage, StageDocument } from 'src/stage/stage.schema';
import { assignTestAtWeekDto } from './dto/assignTestAtWeek.dto';
import { Test, TestDocument } from 'src/test/test.schema';

@Injectable()
export class WeekService {
	constructor(
		private WeekRepository: WeekRepository,
		@InjectModel(Stage.name) private stageModel: Model<StageDocument>,
		@InjectModel(Test.name) private testModel: Model<TestDocument>,
	) {}

	async create(inputs: WeekDto, stageId: string, user: User): Promise<Week> {
		// Check if the parent object exists
		const parentExists = await this.stageModel.exists({
			_id: stageId,
		});

		if (parentExists) {
			// Create a new child object and set the foreign key to the parent object's id
			const dto: WeekDto = {
				creatorId: user._id,
				stage: stageId,
				...inputs,
			};

			return this.WeekRepository.onCreate(dto);
		} else {
			throw new HttpException(
				`Stage with id ${stageId} not found`,
				HttpStatus.NOT_FOUND,
			);
		}
	}

	get(id: string): Promise<Week> {
		return this.WeekRepository.getById(id);
	}

	getAll(user: User): Promise<Week[]> {
		return this.WeekRepository.getAll(user);
	}

	async update(user: User, inputs: WeekDto, id: string): Promise<Week> {
		let updated: WeekDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.WeekRepository.onUpdate(id, updated);
	}

	async assignTest(user: User, inputs: assignTestAtWeekDto) {
		// Check if the parent object exists
		const parentExists = await this.testModel.exists({
			_id: inputs.testId,
		});

		if (parentExists) {
			// Create a new child object and set the foreign key to the parent object's id
			let week: Week = await this.get(inputs.weekId);
			week.test = inputs.testId;

			return this.WeekRepository.onUpdate(week._id.toString(), week);
		} else {
			throw new HttpException(
				`Test with id ${inputs.testId} not found`,
				HttpStatus.NOT_FOUND,
			);
		}
	}
}
