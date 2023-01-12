import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { StageController } from './stage.controller';
import { Stage } from './stage.entity';
import { StageRepository } from './stage.repository';
import { StageService } from './stage.service';

@Module({
	imports: [TypeOrmModule.forFeature([Stage]), AuthModule],
	providers: [StageRepository, StageService],
	controllers: [StageController],
})
export class StageModule {}
