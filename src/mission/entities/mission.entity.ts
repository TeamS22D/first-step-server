import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rubric } from '../../rubric/entities/rubric.entity';
import { UserMission } from '../../user-mission/entities/user-mission.entity';
import { MissionTheme } from '../types/missoin-theme.enum';

@Entity({ name: 'mission' })
export class Mission {
  @PrimaryGeneratedColumn()
  missionId: number;

  @ManyToOne(() => Rubric, (rubric) => rubric.missions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'rubric_id' })
  rubric: Rubric;

  @OneToMany(() => UserMission, (user_mission) => user_mission.mission)
  userMissions: UserMission[];

  @Column({ nullable: false })
  missionName: string;

  @Column({
    type: 'enum',
    enum: MissionTheme,
    default: MissionTheme.DOCUMENT,
  })
  missionTheme: MissionTheme;

  @Column({ type: 'text', nullable: false })
  body: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'text', nullable: true })
  referenceAnswer?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
