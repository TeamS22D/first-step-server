import {
  Column,
  BeforeInsert,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { UserMissionEntity } from './userMission.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  user_id: number;
  
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

  @OneToMany(() => UserMissionEntity, userMission => userMission.user)
  userMissions: UserMissionEntity[];

  @BeforeInsert()
  private before() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}