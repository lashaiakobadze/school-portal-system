import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './user.repository';
import { User, UserSchema } from './user.schema';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from './roles.guard';
import { LocalStrategy } from './jwt/local.strategy';
import { JwtRefreshTokenStrategy } from './jwt/jwt-refresh.strategy';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';

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
		JwtStrategy,
	],
	controllers: [AuthController],
	exports: [PassportModule, AuthService, UserRepository, RolesGuard],
})
export class AuthModule {}
