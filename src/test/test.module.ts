import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { TestController } from './test.controller';
import { TestRepository } from './test.repository';
import { Test, TestSchema } from './test.schema';
import { TestService } from './test.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
		AuthModule,
	],
	controllers: [TestController],
	providers: [TestService, TestRepository],
	exports: [TestService],
})
export class TestModule {}
