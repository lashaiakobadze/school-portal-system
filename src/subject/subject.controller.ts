import { Body, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.schema';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { SubjectDto } from './dto/subject.dto';
import { Subject } from './subject.schema';
import { SubjectService } from './subject.service';

@UseInterceptors(MongooseClassSerializerInterceptor(Subject))
@Controller('subject')
export class SubjectController {
    constructor(private subjectService: SubjectService) {}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post('create')
	create(@Body() inputs: SubjectDto, @GetUser() user: User): Promise<Subject> {
		return this.subjectService.create(inputs, user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('get/:id')
	get(@Param('id') id: string): Promise<Subject> {
		return this.subjectService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<Subject[]> {
		return this.subjectService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Put('update/:id')
	update(
		@Param('id') id: string,
		@Body() inputs: SubjectDto,
		@GetUser() user: User,
	): Promise<Subject> {
		return this.subjectService.update(user, inputs, id);
	}
}
