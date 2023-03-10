import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicFile, PublicFileSchema } from './public-file.schema';
import { PublicFileService } from './public-file.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: PublicFile.name, schema: PublicFileSchema },
		]),
		ConfigModule,
	],
	providers: [PublicFileService],
	exports: [PublicFileService],
})
export class PublicFileModule {}
