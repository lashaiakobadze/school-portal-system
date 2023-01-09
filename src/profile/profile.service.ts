import {
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { ProfileDto } from './dto/profile.dto';
import { ProfileRepository } from './profile.repository';
import { v4 as uuid } from 'uuid';
import { Profile } from './profile.entity';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/auth/models/role.enum';

@Injectable()
export class ProfileService {
	constructor(
		private profileRepository: ProfileRepository,
		private authService: AuthService,
	) {}

	registrationProfile(profileInputs: ProfileDto, user: User): Promise<Profile> {
		const profileDto: ProfileDto = {
			id: uuid(),
			user: user.id,
			roles: user.roles,
			...profileInputs,
		};

		return this.profileRepository.createProfile(profileDto);
	}

	getProfile(user: User): Promise<Profile> {
		return this.profileRepository.getProfileByUserId(user.id);
	}

	getProfiles(user: User): Promise<Profile[]> {
		return this.profileRepository.getProfiles(user);
	}

	async editProfile(user: User, profileInputs: ProfileDto): Promise<Profile> {
		let profile: Profile = await this.profileRepository.getProfileByUserId(
			user.id,
		);

		let updatedProfile: Profile = {
			...profile,
			...profileInputs,
			updatedDate: new Date(),
		};

		return this.profileRepository.updateProfile(updatedProfile);
	}

	async updateProfile(
		user: User,
		profileInputs: ProfileDto,
		profileId: string,
	): Promise<Profile> {
		let profile: Profile = await this.profileRepository.getProfileById(
			profileId,
		);
		let profileUser: User = await this.authService.getUserById(profile.user);

		// Check if user exist.
		if (!profileUser) {
			throw new UnauthorizedException("This user doesn't exist.");
		}

		if (
			profileUser.roles.some(role => role === Role.MAIN_ADMIN) &&
			profileUser.id !== user.id
		) {
			throw new ForbiddenException("You can't update main admin's profile.");
		}

		// If action author is main admin.
		if (user.roles.some(role => role === Role.MAIN_ADMIN)) {
			let updatedProfile: Profile = {
				...profile,
				...profileInputs,
				updatedDate: new Date(),
			};

			return this.profileRepository.updateProfile(updatedProfile);
		}

		// If action author is admin.
		if (
			user.roles.some(role => role === Role.ADMIN) &&
			!profileUser.roles.some(role => role === Role.ADMIN)
		) {
			let updatedProfile: Profile = {
				...profile,
				...profileInputs,
				updatedDate: new Date(),
			};

			return this.profileRepository.updateProfile(updatedProfile);
		}

		// If action author is teacher.
		if (
			user.roles.some(role => role === Role.TEACHER) &&
			!profileUser.roles.some(role => role === Role.ADMIN) &&
			!profileUser.roles.some(role => role === Role.TEACHER)
		) {
			let updatedProfile: Profile = {
				...profile,
				...profileInputs,
				updatedDate: new Date(),
			};

			return this.profileRepository.updateProfile(updatedProfile);
		}

		throw new ForbiddenException("You can't this action with your status.");
	}
}
