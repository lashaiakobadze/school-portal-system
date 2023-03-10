import {
	ConflictException,
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { Profile, ProfileDocument } from './profile.schema';
import { ProfileDto } from './dto/profile.dto';
import { User } from 'src/auth/user.schema';
import { Role } from 'src/auth/models/role.enum';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId } from 'mongoose';

import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { transaction } from 'src/shared/utils/transaction';
import { hasRole } from 'src/shared/decorators/has-role.decorator';
import MongoError from 'src/shared/enums/mongoError.enum';

@Injectable()
export class ProfileRepository {
	constructor(
		@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
		// @InjectConnection() private readonly connection: mongoose.Connection,
		@InjectConnection() private connection: mongoose.Connection,
	) {}

	async createProfile(profileDto: ProfileDto, user: User): Promise<Profile> {
		try {
			const newProfile = await new this.profileModel({
				...profileDto,
				user,
			}).save();

			return newProfile;
		} catch (error) {
			console.log(error);			
			if (error.code === MongoError.DuplicateKey) {
				throw new ConflictException('Profile already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
			}
		}
	}

	async update(id: string, profileData: ProfileDto): Promise<Profile> {
		try {
			const profile = await this.profileModel
				.findByIdAndUpdate(id, profileData)
				.setOptions({ overwrite: false, new: true })
				// .findOneAndReplace({ _id: id }, profileData, { new: true }) // if we want replace document.
				.populate('user');

			if (!profile) {
				throw new NotFoundException();
			}

			return profile;
		} catch (error) {
			if (error.code === MongoError.DuplicateKey) {
				console.log('error', error);
				throw new ConflictException('Profile already exists');
			} else {
				console.log('error', error);
				throw new HttpException(error?.response, error?.status);
			}
		}
	}

	async findOne(id: string): Promise<Profile> {
		try {
			let profile: Profile = await this.profileModel.findById(id).populate({
				path: 'class',
				populate: {
					path: 'subjects',
					populate: {
						path: 'tests',
						populate: {
							path: 'scores',
							select: 'score',
							match: {
								profile: id
							}
						},
					},
				},
			});

			if (profile) {
				return profile;
			}

			throw new HttpException(
				'Profile with this id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {			
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}

	async getProfileByUserId(profileUserId: ObjectId): Promise<any> {
		try {
			const profile: Profile = await this.profileModel
				.findOne({
					user: profileUserId,
				})
				.populate('user')
				.populate({
					path: 'class',
					populate: {
						path: 'subjects',
						populate: {
							path: 'tests',
							populate: {
								path: 'scores',
							},
						},
					},
				});

			if (profile) {
				return profile;
			}

			throw new HttpException(
				'Profile with this user id does not exist',
				HttpStatus.NOT_FOUND,
			);
		} catch (error) {			
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}

	// Trying to do transaction all methods
	// async getProfiles(user: User): Promise<Profile[]> {
	// 	return transaction(this.connection, async session => {
	// 		return this.profileModel.find().populate('user').session(session).exec();
	// 	});
	// }

	async getProfiles(user: User): Promise<Profile[]> {
		try {
			let profiles: Profile[] = await this.profileModel.find().populate('user');

			if (profiles.length) {
				if (hasRole(Role.MAIN_ADMIN, user.roles)) {
					return profiles;
				} else if (hasRole(Role.ADMIN, user.roles)) {
					return profiles.filter((profile: Profile) => {
						return profile.user.roles.some(
							role => role !== Role.MAIN_ADMIN && role !== Role.ADMIN,
						);
					});
				} else if (hasRole(Role.TEACHER, user.roles)) {
					return profiles.filter((profile: Profile) => {
						return profile.user.roles.some(
							role =>
								role !== Role.MAIN_ADMIN &&
								role !== Role.ADMIN &&
								role !== Role.TEACHER,
						);
					});
				}
			}

			throw new HttpException('Profiles does not exist', HttpStatus.NOT_FOUND);
		} catch (error) {			
			console.log('error', error);
			throw new HttpException(error?.response, error?.status);
		}
	}

	async findAll(
		documentsToSkip = 0,
		limitOfDocuments?: number,
		startId?: string,
		searchQuery?: string,
	) {
		if (!searchQuery) {
			const findQuery = this.profileModel
				.find({
					_id: {
						$gt: startId,
					},
				})
				.sort({ _id: 1 })
				.skip(documentsToSkip)
				.populate('user');

			if (limitOfDocuments) {
				findQuery.limit(limitOfDocuments);
			}

			const results = await findQuery;
			const count = await this.profileModel.count();

			// return { resultsArray: results, count };
			return results;
		} else {
			const filters: FilterQuery<ProfileDocument> = startId
				? {
						_id: {
							$gt: startId,
						},
				  }
				: {};

			if (searchQuery) {
				// Doc: For more option https://www.mongodb.com/docs/manual/reference/operator/query/text/#op._S_text
				filters.$text = {
					$search: searchQuery,
				};
			}

			const findQuery = this.profileModel
				.find(filters)
				.sort({ _id: 1 })
				.skip(documentsToSkip)
				.populate('user');

			if (limitOfDocuments) {
				findQuery.limit(limitOfDocuments);
			}

			const results = await findQuery;
			const count = await this.profileModel.count();

			// ToDo: fix this object property set bug.
			// return { results, count };
			return results;
		}
	}
}
