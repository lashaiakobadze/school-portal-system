import {
	ForbiddenException,
	HttpException,
	HttpStatus,
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
import { hasRole } from 'src/shared/decorators/has-role.decorator';
import { Class, ClassDocument } from 'src/class/class.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PublicFileService } from 'src/public-file/public-file.service';

@Injectable()
export class ProfileService {
	constructor(
		private profileRepository: ProfileRepository,
		private authService: AuthService,
		@InjectModel(Class.name) private classModel: Model<ClassDocument>,
		private readonly filesService: PublicFileService,
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
			hasRole(Role.MAIN_ADMIN, profileUser.roles) &&
			profileUser._id.toString() !== user._id.toString()
		) {
			throw new ForbiddenException("You can't update main admin's profile.");
		}

		// If action author is main admin.
		if (hasRole(Role.MAIN_ADMIN, user.roles)) {
			return this.profileRepository.update(profileId, profileInputs);
		}

		// If action author is admin.
		if (
			hasRole(Role.ADMIN, user.roles) &&
			!hasRole(Role.ADMIN, profileUser.roles)
		) {
			return this.profileRepository.update(profileId, profileInputs);
		}

		// If action author is teacher.
		if (
			hasRole(Role.TEACHER, user.roles) &&
			!hasRole(Role.ADMIN, profileUser.roles) &&
			!hasRole(Role.TEACHER, profileUser.roles)
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
		// Check if the parent object exists
		const parentExists = await this.classModel.exists({ _id: inputs.classId });

		if (parentExists) {
			// Create a new child object and set the foreign key to the parent object's id
			let profile: Profile = await this.get(inputs.studentId);
			profile.class = inputs.classId;

			return this.profileRepository.update(profile._id.toString(), profile);
		} else {
			throw new HttpException(
				`Class with id ${inputs.classId} not found`,
				HttpStatus.NOT_FOUND,
			);
		}
	}

	async addAvatar(user: User, imageBuffer: Buffer, filename: string) {
		let profile: Profile = await this.getProfile(user);

		const avatar = await this.filesService.uploadPublicFile(
			imageBuffer,
			filename,
			profile._id.toString(),
		);

		profile.avatar = avatar;

		return await this.profileRepository.update(profile._id.toString(), profile);
	}

	async deleteAvatar(user: User) {
		let profile: Profile = await this.getProfile(user);
		const fileId = profile.avatar?._id;

		if (fileId) {
			profile.avatar = null;
			await this.profileRepository.update(profile._id.toString(), profile);

			await this.filesService.deletePublicFile(fileId.toString());
		}
	}
}
