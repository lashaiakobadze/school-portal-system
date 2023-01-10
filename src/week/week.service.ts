import { Injectable } from "@nestjs/common";
import { WeekRepository } from "./week.repository";

@Injectable()
export class WeekService {
    constructor(
		private WeekRepository: WeekRepository
	) {}
}