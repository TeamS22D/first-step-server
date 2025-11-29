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

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.LOCAL,
  })
  provider: Provider;

  @OneToMany(() => UserMission, (userMission) => userMission.user)
  userMissions: UserMission[];

  @ManyToMany(() => Bizword)
  @JoinTable({ name: 'user_favorites' })
  favorites: Bizword[];
}
