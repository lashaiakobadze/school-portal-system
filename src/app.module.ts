import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config.schema';
import { UserRepository } from './auth/user.repository';
import { ProfileModule } from './profile/profile.module';
import { StageModule } from './stage/stage.module';
import { ClassModule } from './class/class.module';
import { WeekModule } from './week/week.module';

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
		// ClassModule,
		// StageModule,
		// WeekModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
