import {
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/auth/user.schema';
import { ProfileDto } from './dto/profile.dto';
import { ProfileRepository } from './profile.repository';
import { Profile } from './profile.schema';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/auth/models/role.enum';
import { assignStudentToClassDto } from './dto/assignStudentToClass.dto';

@Injectable()
export class ProfileService {
	constructor(
		private profileRepository: ProfileRepository,
		private authService: AuthService,
	) {}

	registrationProfile(profileInputs: ProfileDto, user: User): Promise<Profile> {
		return this.profileRepository.createProfile(profileInputs, user);
	}

	get(id: string): Promise<Profile> {
		return this.profileRepository.findOne(id);
	}

	getProfile(user: User): Promise<Profile> {
		return this.profileRepository.getProfileByUserId(user._id);
	}

	getProfiles(user: User): Promise<Profile[]> {
		return this.profileRepository.getProfiles(user);
	}

	async editProfile(user: User, profileInputs: ProfileDto): Promise<Profile> {
		let profile = await this.profileRepository.getProfileByUserId(user._id);

		return await this.profileRepository.update(
			profile._id.toString(),
			profileInputs,
		);
	}

	async updateProfile(
		user: User,
		profileInputs: ProfileDto,
		profileId: string,
	): Promise<Profile | any> {
		let profile: Profile = await this.profileRepository.findOne(profileId);
		let profileUser: User = await this.authService.getUserById(
			profile.user._id,
		);

		// Check if user exist.
		if (!profileUser) {
			throw new UnauthorizedException("This user doesn't exist.");
		}

		if (
			profileUser.roles.some(role => role === Role.MAIN_ADMIN) &&
			profileUser._id.toString() !== user._id.toString()
		) {
			throw new ForbiddenException("You can't update main admin's profile.");
		}

		// If action author is main admin.
		if (user.roles.some(role => role === Role.MAIN_ADMIN)) {
			return this.profileRepository.update(profileId, profileInputs);
		}

		// If action author is admin.
		if (
			user.roles.some(role => role === Role.ADMIN) &&
			!profileUser.roles.some(role => role === Role.ADMIN)
		) {
			return this.profileRepository.update(profileId, profileInputs);
		}

		// If action author is teacher.
		if (
			user.roles.some(role => role === Role.TEACHER) &&
			!profileUser.roles.some(role => role === Role.ADMIN) &&
			!profileUser.roles.some(role => role === Role.TEACHER)
		) {
			return this.profileRepository.update(profileId, profileInputs);
		}

		throw new ForbiddenException("You can't this action with your status.");
	}
	
	async findAll(
		documentsToSkip: number,
		limitOfDocuments?: number,
		startId?: string,
		searchQuery?: string,
	) {
		return await this.profileRepository.findAll(
			documentsToSkip,
			limitOfDocuments,
			startId,
			searchQuery,
		);
	}

	async assignStudentToClass(user: User, inputs: assignStudentToClassDto) {
		let profile: Profile = await this.get(inputs.studentId);
		profile.class = inputs.classId;

		return this.profileRepository.update(profile._id.toString(), profile as any);
	}
}
