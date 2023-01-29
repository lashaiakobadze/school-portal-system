import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { StageController } from './stage.controller';
import { Stage, StageSchema } from './stage.schema';
import { StageRepository } from './stage.repository';
import { StageService } from './stage.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Stage.name, schema: StageSchema }]),
		AuthModule
	],
	providers: [StageRepository, StageService],
	controllers: [StageController],
})
export class StageModule {}
