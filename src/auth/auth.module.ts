import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './user.repository';
import { User, UserSchema } from './user.schema';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from '../shared/guards/roles.guard';
import { LocalStrategy } from './jwt/local.strategy';
import { JwtRefreshTokenStrategy } from './jwt/jwt-refresh.strategy';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationController } from './auth-with-server-side/authentication.controller';
import { LocalSerializer } from './auth-with-server-side/local.serializer';

@Module({
	imports: [
		ConfigModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		// ToDo: do it with global option and improve.
		MongooseModule.forFeatureAsync([
			{
				name: User.name,
				useFactory: () => {
					const schema = UserSchema;
					// schema.plugin(require('mongoose-unique-validator'), {
					// 	message: 'User with this name already exist',
					// }); // or you can integrate it without the options   schema.plugin(require('mongoose-unique-validator')
					return schema;
				},
			},
		]),
	],
	providers: [
		AuthService,
		UserRepository,
		RolesGuard,
		LocalStrategy,
		JwtRefreshTokenStrategy,
		JwtService,
		/**
		 * server-side-sessions
		 */
		LocalSerializer,
	],
	controllers: [AuthController, AuthenticationController],
	exports: [PassportModule, AuthService, UserRepository, RolesGuard, ConfigModule],
})
export class AuthModule {}
