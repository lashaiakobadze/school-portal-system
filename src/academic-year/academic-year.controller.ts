import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { HasRoles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User } from 'src/auth/user.schema';
import { AcademicYear } from './academic-year.schema';
import { AcademicYearService } from './academic-year.service';
import { AcademicYearDto } from './dto/academic-year.dto';
import ParamsWithId from 'src/shared/DTOs/paramsWithId';

@Controller('academic-year')
export class AcademicYearController {
	constructor(private academicYearService: AcademicYearService) {}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Post('create')
	create(
		@Body() inputs: AcademicYearDto,
		@GetUser() user: User,
	): Promise<AcademicYear> {
		return this.academicYearService.create(inputs, user);
	}

	@Get('get/:id')
	get(@Param() { id }: ParamsWithId): Promise<AcademicYear> {
		return this.academicYearService.get(id);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Get('get-all')
	getAll(@GetUser() user: User): Promise<AcademicYear[]> {
		return this.academicYearService.getAll(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('update/:id')
	update(
		@Param() { id }: ParamsWithId,
		@Body() inputs: AcademicYearDto,
		@GetUser() user: User,
	): Promise<AcademicYear> {
		return this.academicYearService.update(user, inputs, id);
	}
}
