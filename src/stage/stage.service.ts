import { Injectable } from "@nestjs/common";
import { User } from "src/auth/user.schema";
import { StageDto } from "./dto/stage.dto";
import { Stage } from "./stage.schema";
import { StageRepository } from "./stage.repository";

@Injectable()
export class StageService {
    constructor(
		private stageRepository: StageRepository
	) {}

	async create(inputs: StageDto, classId: string, user: User): Promise<Stage> {
		const dto: StageDto = {
			class: classId,
			creatorId: user._id.toString(),
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