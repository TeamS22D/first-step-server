import {
  Column,
  BeforeInsert,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { UserMission } from './user-mission.entity';
import { Bizword } from '../bizwords/entities/bizword.entity';
import { Provider } from '../auth/dto/social-user.dto';

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

  @OneToMany(() => UserMission, (userMission) => userMission.user)
  userMissions: UserMission[];

  @Column({ type: 'date', nullable: true })
  lastAttendanceDate: Date;

  @Column({ default: 0 })
  attendanceStreak: number;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  provider: Provider;

  @ManyToMany(() => Bizword)
  @JoinTable({ name: 'user_favorites' })
  favorites: Bizword[];
}
