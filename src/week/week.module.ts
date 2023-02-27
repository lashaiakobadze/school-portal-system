import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WeekController } from './week.controller';
import { Week, WeekSchema } from './week.schema';
import { WeekRepository } from './week.repository';
import { WeekService } from './week.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Stage, StageSchema } from 'src/stage/stage.schema';
@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Week.name, schema: WeekSchema },
			{ name: Stage.name, schema: StageSchema },
		]),
		AuthModule,
	],
	providers: [WeekRepository, WeekService],
	controllers: [WeekController],
	exports: [WeekRepository, WeekService],
})
export class WeekModule {}
