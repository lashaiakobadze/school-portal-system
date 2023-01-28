import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.schema';
import { WeekDto } from './dto/week.dto';
import { Week } from './week.entity';
import { WeekService } from './week.service';

@Controller('week')
export class WeekController {
    constructor(private weekService: WeekService) {}

    @HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post('create')
	create(@Body() inputs: WeekDto, @GetUser() user: User): Promise<Week> {
		return this.weekService.create(inputs, user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('get/:id')
	get(@Param('id') id: string): Promise<Week> {
		return this.weekService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<Week[]> {
		return this.weekService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Put('update/:id')
	update(
		@Param('id') id: string,
		@Body() inputs: WeekDto,
		@GetUser() user: User,
	): Promise<Week> {
		return this.weekService.update(user, inputs, id);
	}
}
