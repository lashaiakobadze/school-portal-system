import { Module } from '@nestjs/common';
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
import { AtGuard } from './utils/auth.guard';
import { TestModule } from './test/test.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`.env.stage.${process.env.STAGE}`],
			validationSchema: configValidationSchema,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const database = configService.get('DB_DATABASE');
				const host = configService.get('DB_HOST');
				const port = configService.get('DB_PORT');

				return {
					uri: `mongodb://${host}:${port}`,
					dbName: database,
				};
			},
		}),
		AuthModule,
		ProfileModule,
		ClassModule,
		StageModule,
		WeekModule,
		TeacherModule,
		SubjectModule,
		TestModule,
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
