import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { WeekController } from './week.controller';
import { Week, WeekSchema } from './week.schema';
import { WeekRepository } from './week.repository';
import { WeekService } from './week.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [MongooseModule.forFeature([{ name: Week.name, schema: WeekSchema }]), AuthModule],
	providers: [WeekRepository, WeekService],
	controllers: [WeekController],
})
export class WeekModule {}
