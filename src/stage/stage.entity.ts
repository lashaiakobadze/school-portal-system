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
export class Stage {
	@ObjectIdColumn()
	_id: string;

	@Column({ unique: true })
	@PrimaryGeneratedColumn('uuid')
	id: string;
	
	@Column()
	class: number;

	@Column()
	stage: number;

	@Column()
	week: string;

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn()
	updatedDate: Date;

	@DeleteDateColumn()
	deletedDate: Date;
}
