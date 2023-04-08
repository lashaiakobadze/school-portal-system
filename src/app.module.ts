import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config.schema';
import { ProfileModule } from './profile/profile.module';
import { StageModule } from './stage/stage.module';
import { ClassModule } from './class/class.module';
import { WeekModule } from './week/week.module';
import { TeacherModule } from './teacher/teacher.module';
import { SubjectModule } from './subject/subject.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './shared/guards/auth.guard';
import { TestModule } from './test/test.module';
import { TestScoreModule } from './test-score/test-score.module';
import { AcademicYearModule } from './academic-year/academic-year.module';
import { PublicFileModule } from './public-file/public-file.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`.env.${process.env.STAGE}`],
			validationSchema: configValidationSchema,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const host = configService.get('DB_HOST');
				const port = configService.get('DB_PORT');
				const database = configService.get('DB_DATABASE');
				const username = configService.get('DB_USERNAME');
				const password = configService.get('DB_PASSWORD');
				const url = configService.get('DB_URL');
				const authSecure = configService.get('DB_AUTH_SOURCE');
				const authMechanism = configService.get('DB_AUTH_MECHANISM');

				if (process.env.STAGE === 'dev') {
					return {
						dbName: database,
						uri: `mongodb://${host}:${port}`,
					};
				}
				if (process.env.STAGE === 'prod') {
					return {
						dbName: database,
						uri: `mongodb+srv://${username}:${password}@${url}?authSource=${authSecure}&authMechanism=${authMechanism}`,
					};
				}
			},
		}),
		/**
		 * Disadvantage: it is not shared between multiple instances of our application.
		 * To deal with this issue, we can use Redis.
		 */
		CacheModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				store: redisStore,
				host: configService.get('REDIS_HOST'),
				port: configService.get('REDIS_PORT'),
				ttl: 120,
				max: 100,
			}),
			isGlobal: true,
		}),
		AuthModule,
		ProfileModule,
		ClassModule,
		StageModule,
		WeekModule,
		TeacherModule,
		SubjectModule,
		TestModule,
		TestScoreModule,
		AcademicYearModule,
		PublicFileModule,
		SubscriberModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AtGuard,
		},
	],
})
export class AppModule {}
