import { Module } from '@nestjs/common';
import { Profile, ProfileSchema } from './profile.schema';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		// ToDo: do it with global option and improve.
		MongooseModule.forFeatureAsync([
			{
				name: Profile.name,
				useFactory: () => {
					const schema = ProfileSchema;
					// schema.plugin(require('mongoose-unique-validator'), {
					// 	message: 'Profile with this name already exist',
					// }); // or you can integrate it without the options   schema.plugin(require('mongoose-unique-validator')
					return schema;
				},
			},
		]),
		AuthModule,
	],
	providers: [ProfileRepository, ProfileService],
	controllers: [ProfileController],
})
export class ProfileModule {}
