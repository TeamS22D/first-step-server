import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Bizword } from 'src/bizwords/entities/bizword.entity';
import { Role } from '../types/user-role.enum';
import { UserMission } from '../../user-mission/entities/user-mission.entity';
import { Provider } from '../../auth/dto/social-user.dto';
import { Occupation } from '../types/occupation.enum';
import { Job } from '../types/job.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  email: string;

  @Column({ default: false, nullable: true })
  isVerified: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: 'date', nullable: true })
  lastAttendanceDate: Date;

  @Column({ default: 0 })
  attendanceStreak: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ default: '인턴' })
  rank: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  provider: Provider;

  @Column({
    type: 'enum',
    enum: Occupation,
    default: Occupation.IT,
    nullable: true,
  })
  occupation: Occupation;

  @Column({
    type: 'enum',
    enum: Job,
    default: Job.DEVELOPER,
    nullable: true,
  })
  job: Job;

  @OneToMany(() => UserMission, (userMission) => userMission.user)
  userMissions: UserMission[];

  @ManyToMany(() => Bizword)
  @JoinTable({ name: 'user_favorites' })
  favorites: Bizword[];

  @ManyToMany(() => Bizword)
  @JoinTable({ name: 'user_wrong_words' })
  wrongWords: Bizword[];
}
