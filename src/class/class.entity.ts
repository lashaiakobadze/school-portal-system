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
	creatorId: string;
	
	@Column()
	class: number;

	@Column()
	academicYear: string;

	@Column()
	currentStageId: string;

	@Column()
	stages: string[];

	@Column()
	subjects: string[];

	@Column()
	teachers: string;

	@Column()
	students: string;

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn()
	updatedDate: Date;

	@DeleteDateColumn()
	deletedDate: Date;
}
