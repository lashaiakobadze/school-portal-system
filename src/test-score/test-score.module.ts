import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Profile, ProfileSchema } from 'src/profile/profile.schema';
import { Test, TestSchema } from 'src/test/test.schema';
import { TestScoreController } from './test-score.controller';
import { TestScoreRepository } from './test-score.repository';
import { TestScore, TestScoreSchema } from './test-score.schema';
import { TestScoreService } from './test-score.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: TestScore.name, schema: TestScoreSchema },
			{ name: Test.name, schema: TestSchema },
			{ name: Profile.name, schema: ProfileSchema },
		]),
		AuthModule,
	],
	controllers: [TestScoreController],
	providers: [TestScoreService, TestScoreRepository],
})
export class TestScoreModule {}
