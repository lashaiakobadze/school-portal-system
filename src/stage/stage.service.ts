import { Injectable } from "@nestjs/common";
import { User } from "src/auth/user.schema";
import { StageDto } from "./dto/stage.dto";
import { Stage } from "./stage.schema";
import { StageRepository } from "./stage.repository";
import { v4 as uuid } from 'uuid';


@Injectable()
export class StageService {
    constructor(
		private stageRepository: StageRepository
	) {}

	create(inputs: StageDto, user: User): Promise<Stage> {
		const dto: StageDto = {
			id: uuid(),
			creatorId: user._id,
			...inputs,
		};

		return this.stageRepository.onCreate(dto);
	}

	get(id: string): Promise<Stage> {
		return this.stageRepository.getById(id);
	}

	getAll(user: User): Promise<Stage[]> {
		return this.stageRepository.getAll(user);
	}

	async update(user: User, inputs: StageDto, id: string): Promise<Stage> {
		console.log('user', user);

		let updated: StageDto = {
			...inputs,
			creatorId: user._id.toString(),
		};

		return this.stageRepository.onUpdate(id, updated);
	}
}