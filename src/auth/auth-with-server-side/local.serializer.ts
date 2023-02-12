import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../user.schema';
import { AuthService } from '../auth.service';
import { ObjectId } from 'mongoose';

@Injectable()
export class LocalSerializer extends PassportSerializer {
	constructor(private readonly authService: AuthService) {
		super();
	}

	serializeUser(user: User, done: CallableFunction) {
		done(null, user._id);
	}

	async deserializeUser(userId: ObjectId, done: CallableFunction) {
		const user = await this.authService.getUserById(userId);
		done(null, user);
	}
}
