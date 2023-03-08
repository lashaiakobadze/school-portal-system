import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

import { PublicFile, PublicFileDocument } from './public-file.schema';

@Injectable()
export class PublicFileService {
	constructor(
		@InjectModel(PublicFile.name)
		private publicFileModel: Model<PublicFileDocument>,
		private readonly configService: ConfigService,
	) {}

	async uploadPublicFile(
		dataBuffer: Buffer,
		filename: string,
		uniqueId: string,
	) {
		const s3 = new S3();
		const uploadResult = await s3
			.upload({
				Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
				Body: dataBuffer,
				Key: `${uniqueId}-${filename}`,
			})
			.promise();

		const newFile = await new this.publicFileModel({
			key: uploadResult.Key,
			url: uploadResult.Location,
		}).save();

		return newFile;
	}

	async deletePublicFile(fileId: string) {
		const file = await this.publicFileModel.findById({ id: fileId });
		const s3 = new S3();
		await s3
			.deleteObject({
				Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
				Key: file.key,
			})
			.promise();

		await this.publicFileModel.deleteOne({ id: fileId });
	}
}
