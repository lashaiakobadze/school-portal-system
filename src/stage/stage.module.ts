import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { StageController } from './stage.controller';
import { Stage } from './stage.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Stage]), AuthModule],
	providers: [Stage],
	controllers: [StageController],
})
export class StageModule {}
