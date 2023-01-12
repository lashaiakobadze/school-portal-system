import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ClassController } from './class.controller';
import { Class } from './class.entity';
import { ClassRepository } from './class.repository';
import { ClassService } from './class.service';

@Module({
	imports: [TypeOrmModule.forFeature([Class]), AuthModule],
	providers: [ClassRepository, ClassService],
	controllers: [ClassController],
})
export class ClassModule {}
