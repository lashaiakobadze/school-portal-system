import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Role } from './models/role.enum';
import { Status } from './models/user-status.enum';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string;

  @Column({ unique: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  passwordConfirm: string;

  @Column()
  creatorId: string;

  @Column()
  roles?: Role[];

  @Column({
    nullable: true
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;

  @Column() 
  status: Status;

  @Column()
  profile: string;
}
