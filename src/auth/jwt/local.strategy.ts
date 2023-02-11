import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthenticationService } from '../authWithServerside/authentication.service';
import { User } from '../user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	// constructor(private authService: AuthService) {
	//   super();
	// }

	// async validate(username: string, password: string): Promise<any> {
	//   const user = await this.authService.checkUser({ username, password });

	//   if (!user) {
	//     throw new UnauthorizedException();
	//   }

	//   return user;
	// }

	/**
	 * server-side-sessions
	 */
	constructor(private authenticationService: AuthenticationService) {
		super({
			usernameField: 'email',
		});
	}
	async validate(email: string, password: string): Promise<User> {
		return this.authenticationService.getAuthenticatedUser(email, password);
	}
}
