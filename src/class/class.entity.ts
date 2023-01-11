import { Role } from 'src/auth/models/role.enum';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ObjectIdColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Class {
	@ObjectIdColumn()
	_id: string;

	@Column({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;
	
	@Column()
	class: number;

	@Column()
	academicYear: string;

	@Column()
	currentStage: string;

	@Column('string', { array: true })
	stages: string[];

	@Column('string', { array: true })
	subjects: string[];

	@Column()
	teachers: Role.TEACHER[];

	@Column()
	students: Role.STUDENT[];

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn()
	updatedDate: Date;

	@DeleteDateColumn()
	deletedDate: Date;
}
