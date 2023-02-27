import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { StageController } from './stage.controller';
import { Stage, StageSchema } from './stage.schema';
import { StageRepository } from './stage.repository';
import { StageService } from './stage.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from 'src/class/class.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Stage.name, schema: StageSchema },
			{ name: Class.name, schema: ClassSchema },
		]),
		AuthModule,
	],
	providers: [StageRepository, StageService],
	controllers: [StageController],
	exports: [StageRepository, StageService],
})
export class StageModule {}
