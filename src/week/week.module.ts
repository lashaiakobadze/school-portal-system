import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { WeekController } from './week.controller';
import { Week } from './week.entity';
import { WeekRepository } from './week.repository';
import { WeekService } from './week.service';

@Module({
	imports: [TypeOrmModule.forFeature([Week]), AuthModule],
	providers: [WeekRepository, WeekService],
	controllers: [WeekController],
})
export class WeekModule {}
