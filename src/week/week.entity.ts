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
export class Week {
	@ObjectIdColumn()
	_id: string;

	@Column({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	creatorId: string;

	@Column()
	testScore: number;

	@Column()
	homeworkScore: number;

	@Column()
	onlineTestScore: number;

	@Column()
	activityScore: number;

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn()
	updatedDate: Date;

	@DeleteDateColumn()
	deletedDate: Date;
}
