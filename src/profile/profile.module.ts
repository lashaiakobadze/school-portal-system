import { Module } from '@nestjs/common';
import { Profile, ProfileSchema } from './profile.schema';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from 'src/class/class.schema';
import { PublicFileModule } from 'src/public-file/public-file.module';

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
		MongooseModule.forFeature([
			{ name: Class.name, schema: ClassSchema },
		]),
		AuthModule,
		PublicFileModule
	],
	providers: [ProfileRepository, ProfileService],
	controllers: [ProfileController],
})
export class ProfileModule {}
