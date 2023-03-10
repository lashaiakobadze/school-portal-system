import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { HasRoles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User } from 'src/auth/user.schema';
import MongooseClassSerializerInterceptor from 'src/shared/interceptors/mongooseClassSerializer.interceptor';
import { assignStudentToClassDto } from './dto/assignStudentToClass.dto';
import { ProfileDto } from './dto/profile.dto';
import { Profile } from './profile.schema';
import { ProfileService } from './profile.service';
import { PaginationParams } from 'src/shared/DTOs/paginationParams';
import ParamsWithId from 'src/shared/DTOs/paramsWithId';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';

@Controller('profile')
@UseInterceptors(MongooseClassSerializerInterceptor(Profile))
export class ProfileController {
	constructor(private profileService: ProfileService) {}
	
	@Post('registration')
	signUp(
		@Body() profileInputs: ProfileDto,
		@GetUser() user: User,
	): Promise<Profile> {
		return this.profileService.registrationProfile(profileInputs, user);
	}

	@Get('get-profile/:id')
	getProfile(
		@Param() { id }: ParamsWithId,
	): Promise<Profile> {
		return this.profileService.get(id);
	}
	
	@Get('get-profile-by-user')
	getProfileByUser(@GetUser() user: User): Promise<Profile> {
		return this.profileService.getProfile(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
	@UseGuards(RolesGuard)
	@Get('get-profiles')
	getProfiles(@GetUser() user: User): Promise<Profile[]> {
		return this.profileService.getProfiles(user);
	}

	
	@Put('edit-profile')
	editProfile(
		@Body() profileInputs: ProfileDto,
		@GetUser() user: User,
	): Promise<Profile> {
		return this.profileService.editProfile(user, profileInputs);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
	@UseGuards(RolesGuard)
	@Put('update-profile/:id')
	updateProfile(
		@Param() { id }: ParamsWithId,
		@Body() profileInputs: ProfileDto,
		@GetUser() user: User,
	): Promise<Profile> | any {
		return this.profileService.updateProfile(
			user,
			profileInputs,
			id,
		);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
	@UseGuards(RolesGuard)
	@Get('get-search-profiles')
	async getAllProfiles(
	  @Query() { skip, limit, startId }: PaginationParams,
	  @Query('searchQuery') searchQuery: string,
	) {
	  return this.profileService.findAll(skip, limit, startId, searchQuery);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN)
	@UseGuards(RolesGuard)
	@Put('assign-student-to-class')
	assignStudentToClass(
		@Body() inputs: assignStudentToClassDto,
		@GetUser() user: User,
	): Promise<Profile> {
		return this.profileService.assignStudentToClass(user, inputs);
	}

	@Post('avatar')
	@UseInterceptors(FileInterceptor('file'))
	async addAvatar(@GetUser() user: User, @UploadedFile() file: Multer.File) {
	  return this.profileService.addAvatar(user, file.buffer, file.originalname);
	}
}
