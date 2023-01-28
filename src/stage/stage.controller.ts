import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.schema';
import { StageDto } from './dto/stage.dto';
import { Stage } from './stage.entity';
import { StageService } from './stage.service';

@Controller('stage')
export class StageController {
    constructor(private stageService: StageService) {}

    @HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post('create')
	create(@Body() inputs: StageDto, @GetUser() user: User): Promise<Stage> {
		return this.stageService.create(inputs, user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('get/:id')
	get(@Param('id') id: string): Promise<Stage> {
		return this.stageService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<Stage[]> {
		return this.stageService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Put('update/:id')
	update(
		@Param('id') id: string,
		@Body() inputs: StageDto,
		@GetUser() user: User,
	): Promise<Stage> {
		return this.stageService.update(user, inputs, id);
	}
}
