import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ClassController } from './class.controller';
import { Class } from './class.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Class]), AuthModule],
	providers: [Class],
	controllers: [ClassController],
})
export class ClassModule {}
