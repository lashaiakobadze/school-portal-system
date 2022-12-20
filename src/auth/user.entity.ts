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
  roles?: Role[];

  // @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  // tasks: Task[];
}

