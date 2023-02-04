import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.schema';
import MongooseClassSerializerInterceptor from 'src/utils/mongooseClassSerializer.interceptor';
import { PaginationParams } from 'src/utils/paginationParams';
import ParamsWithId from 'src/utils/paramsWithId';
import { ProfileDto } from './dto/profile.dto';
import { Profile } from './profile.schema';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseInterceptors(MongooseClassSerializerInterceptor(Profile))
export class ProfileController {
	constructor(private profileService: ProfileService) {}

	@UseGuards(JwtAuthGuard)
	@Post('registration')
	signUp(
		@Body() profileInputs: ProfileDto,
		@GetUser() user: User,
	): Promise<Profile> {
		return this.profileService.registrationProfile(profileInputs, user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('get-profile')
	getProfile(@GetUser() user: User): Promise<Profile> {
		return this.profileService.getProfile(user);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('get-profiles')
	getProfiles(@GetUser() user: User): Promise<Profile[]> {
		return this.profileService.getProfiles(user);
	}

	@UseGuards(JwtAuthGuard)
	@Put('edit-profile')
	editProfile(
		@Body() profileInputs: ProfileDto,
		@GetUser() user: User,
	): Promise<Profile> {
		return this.profileService.editProfile(user, profileInputs);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Put('update-profile/:id')
	updateProfile(
		@Param('id') profileId: string,
		// @Param() { id }: ParamsWithId,
		@Body() profileInputs: ProfileDto,
		@GetUser() user: User,
	): Promise<Profile> | any {
		return this.profileService.updateProfile(
			user,
			profileInputs,
			profileId,
		);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('get-search-profiles')
	async getAllProfiles(
	  @Query() { skip, limit, startId }: PaginationParams,
	  @Query('searchQuery') searchQuery: string,
	) {
	  return this.profileService.findAll(skip, limit, startId, searchQuery);
	}
}
