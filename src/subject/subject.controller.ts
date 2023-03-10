import { Body, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { HasRoles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User } from 'src/auth/user.schema';
import MongooseClassSerializerInterceptor from 'src/shared/interceptors/mongooseClassSerializer.interceptor';
import { assignSubjectToClassDto } from './dto/assignSubjectToClass.dto';
import { SubjectDto } from './dto/subject.dto';
import { Subject } from './subject.schema';
import { SubjectService } from './subject.service';
import ParamsWithId from 'src/shared/DTOs/paramsWithId';

@UseInterceptors(MongooseClassSerializerInterceptor(Subject))
@Controller('subject')
export class SubjectController {
    constructor(private subjectService: SubjectService) {}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Post('create')
	create(@Body() inputs: SubjectDto, @GetUser() user: User): Promise<Subject> {
		return this.subjectService.create(inputs, user);
	}

	
	@Get('get/:id')
	get(@Param() { id }: ParamsWithId): Promise<Subject> {
		return this.subjectService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<Subject[]> {
		return this.subjectService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('update/:id')
	update(
		@Param() { id }: ParamsWithId,
		@Body() inputs: SubjectDto,
		@GetUser() user: User,
	): Promise<Subject> {
		return this.subjectService.update(user, inputs, id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('assign-to-class')
	assignToClass(
		@Body() inputs: assignSubjectToClassDto,
		@GetUser() user: User,
	): Promise<Subject> {
		return this.subjectService.assignToClass(user, inputs);
	}
}
