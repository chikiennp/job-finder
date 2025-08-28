import { Role } from 'src/common/enums/role.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Job } from './job.entity';
import { AbstractEntity } from './base.entity';

@Entity('users')
export class User extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column('simple-array')
  roles: Role[];

  @Column()
  isActive: boolean;

  @OneToMany(() => Job, (job) => job.employer)
  jobs: Job[];
}
