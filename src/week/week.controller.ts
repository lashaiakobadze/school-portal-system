import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { HasRoles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User } from 'src/auth/user.schema';
import MongooseClassSerializerInterceptor from 'src/shared/interceptors/mongooseClassSerializer.interceptor';
import { assignTestAtWeekDto } from './dto/assignTestAtWeek.dto';
import { WeekDto } from './dto/week.dto';
import { Week } from './week.schema';
import { WeekService } from './week.service';
import ParamsWithId from 'src/shared/DTOs/paramsWithId';

@Controller('week')
@UseInterceptors(MongooseClassSerializerInterceptor(Week))
export class WeekController {
	constructor(private weekService: WeekService) {}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Post('create/:id')
	create(
		@Body() inputs: WeekDto,
		@Param('id') stageId: string,
		@GetUser() user: User,
	): Promise<Week> {
		return this.weekService.create(inputs, stageId, user);
	}

	@Get('get/:id')
	get(@Param() { id }: ParamsWithId): Promise<Week> {
		return this.weekService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<Week[]> {
		return this.weekService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('update/:id')
	update(
		@Param() { id }: ParamsWithId,
		@Body() inputs: WeekDto,
		@GetUser() user: User,
	): Promise<Week> {
		return this.weekService.update(user, inputs, id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('assign-test')
	assignTest(
		@Body() inputs: assignTestAtWeekDto,
		@GetUser() user: User,
	): Promise<Week> {
		return this.weekService.assignTest(user, inputs);
	}
}
