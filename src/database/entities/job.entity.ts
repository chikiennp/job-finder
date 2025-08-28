import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AbstractEntity } from './base.entity';
import { Status } from '../../common/enums/status.enum';

@Entity('jobs')
export class Job extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.jobs, { eager: true })
  @JoinColumn({ name: 'employerId' })
  employer: User;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  salary: number;

  @Column('simple-json', { nullable: true })
  skills: string[];

  @Column({ nullable: true })
  postImage: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Pending,
  })
  status: Status;
}
