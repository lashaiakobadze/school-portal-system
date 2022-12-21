/* eslint-disable prettier/prettier */
// import { Task } from 'src/tasks/tasks.entity';
import { Entity, PrimaryGeneratedColumn, Column, ObjectIdColumn } from 'typeorm';
import { Role } from './models/role.enum';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string;
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  creatorId: string;

  @Column()
  roles?: Role[];
}

