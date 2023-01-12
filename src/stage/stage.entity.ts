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
export class Stage {
	@ObjectIdColumn()
	_id: string;

	@Column({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	stage: number;

	@Column()
	currentWeekId: string;

	@Column()
	weeks: string[];

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn()
	updatedDate: Date;

	@DeleteDateColumn()
	deletedDate: Date;
}
