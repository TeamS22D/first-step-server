import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MissionEntity } from './mission.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'user-missions' })
export class UserMissionEntity {
  @PrimaryGeneratedColumn()
  user_mission_id: number;

  // User FK
  @Column({ name: 'user_id', type: 'int' })
  user_id: number;

  @ManyToOne(() => UserEntity, user => user.userMissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })

  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // Mission FK
  @Column({ name: 'mission_id', type: 'int' })
  mission_id: number;

  @ManyToOne(() => MissionEntity, mission => mission.userMissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })

  @JoinColumn({ name: 'mission_id' })
  mission: MissionEntity;

  @Column({ nullable: true })
  duration_days: number;

  @Column({ nullable: true, type: 'date' })
  start_date: Date;

  @Column({ nullable: true, type: 'date' })
  end_date: Date;
}
