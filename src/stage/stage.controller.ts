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
import { StageDto } from './dto/stage.dto';
import { Stage } from './stage.schema';
import { StageService } from './stage.service';
import ParamsWithId from 'src/shared/DTOs/paramsWithId';

@Controller('stage')
@UseInterceptors(MongooseClassSerializerInterceptor(Stage))
export class StageController {
	constructor(private stageService: StageService) {}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Post('create/:id')
	create(
		@Body() inputs: StageDto,
		@Param('id') classId: string,
		@GetUser() user: User,
	): Promise<Stage> {
		return this.stageService.create(inputs, classId, user);
	}

	@Get('get/:id')
	get(@Param() { id }: ParamsWithId): Promise<Stage> {
		return this.stageService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<Stage[]> {
		return this.stageService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('update/:id')
	update(
		@Param() { id }: ParamsWithId,
		@Body() inputs: StageDto,
		@GetUser() user: User,
	): Promise<Stage> {
		return this.stageService.update(user, inputs, id);
	}
}
