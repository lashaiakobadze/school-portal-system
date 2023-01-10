import { Injectable } from "@nestjs/common";
import { StageRepository } from "./stage.repository";

@Injectable()
export class StageService {
    constructor(
		private stageRepository: StageRepository
	) {}
}