import {
  Column,
  BeforeInsert,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { UserMission } from './user-mission.entity';

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

  @BeforeInsert()
  private before() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}