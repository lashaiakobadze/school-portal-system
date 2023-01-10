import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { WeekController } from './week.controller';
import { Week } from './week.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Week]), AuthModule],
	providers: [Week],
	controllers: [WeekController],
})
export class WeekModule {}
