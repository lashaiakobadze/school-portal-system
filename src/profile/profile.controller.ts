import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.entity';
import { ProfileDto } from './dto/profile.dto';
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

@Controller('profile')
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
	@Post('edit-profile')
	editProfile(
		@Body() profileInputs: ProfileDto,
		@GetUser() user: User,
	): Promise<Profile> {
		return this.profileService.editProfile(user, profileInputs);
	}

	@HasRoles(Role.MAIN_ADMIN, Role.ADMIN, Role.TEACHER)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Post('update-profile/:id')
	updateProfile(
		@Param('id') profileId: string,
		@Body() profileInputs: ProfileDto,
		@GetUser() user: User,
	): Promise<Profile> {
		return this.profileService.updateProfile(
			user,
			profileInputs,
			profileId,
		);
	}
}
