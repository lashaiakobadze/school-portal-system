import { Body, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.schema';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { WeekDto } from './dto/week.dto';
import { Week } from './week.schema';
import { WeekService } from './week.service';

@Controller('week')
@UseInterceptors(MongooseClassSerializerInterceptor(Week))
export class WeekController {
    constructor(private weekService: WeekService) {}

    @HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Post('create/:id')
	create(@Body() inputs: WeekDto,  @Param('id') stageId: string, @GetUser() user: User): Promise<Week> {
		return this.weekService.create(inputs, stageId, user);
	}

	@Get('get/:id')
	get(@Param('id') id: string): Promise<Week> {
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
		@Param('id') id: string,
		@Body() inputs: WeekDto,
		@GetUser() user: User,
	): Promise<Week> {
		return this.weekService.update(user, inputs, id);
	}
}
