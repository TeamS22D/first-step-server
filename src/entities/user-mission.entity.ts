import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Mission } from './mission.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'users_missions' })
export class UserMission {
  @PrimaryGeneratedColumn()
  userMissionId: number;

  @ManyToOne(() => Mission, (mission) => mission.userMissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mission_id' })
  mission: Mission;

  @Column({ type: 'text' })
  answer: string;

  @ManyToOne(() => UserEntity, (user) => user.userMissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: number;

  @Column('datetime')
  createdAt: Date;

  @Column('timestamp')
  updatedAt: Date;
}