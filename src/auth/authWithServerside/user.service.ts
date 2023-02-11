import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user.schema';
import CreateUserDto from './createUser.dto';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async getByEmail(email: string) {
		const user = await this.userModel.findOne({ email });
		if (user) {
			return user;
		}
		throw new HttpException(
			'User with this email does not exist',
			HttpStatus.NOT_FOUND,
		);
	}

	async getById(id: any) {
		const user = await this.userModel.findOne({ id });
		if (user) {
			return user;
		}
		throw new HttpException(
			'User with this id does not exist',
			HttpStatus.NOT_FOUND,
		);
	}

	async create(userData: CreateUserDto) {
		const newUser = await this.userModel.create(userData);
		await newUser.save();
		return newUser;
	}
}
