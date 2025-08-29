import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Job } from './job.entity';
import { Status } from '../../common/enums/status.enum';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.applications)
  appliedBy: User;

  @ManyToOne(() => Job, (job) => job.applications)
  job: Job;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Pending,
  })
  status: Status;

  @Column({ nullable: true })
  resumeUrl?: string;

  @Column({ nullable: true })
  coverLetter?: string;
}
