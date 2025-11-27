import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rubric } from './rubric.entity';
import { UserMission } from './user-mission.entity';

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
  title: string;

  @Column()
  missionTheme: string;

  @Column({ type: 'text', nullable: false })
  body: string;

  @Column({ type: 'text', nullable: true })
  referenceAnswer: string;

  @Column('datetime')
  createdAt: Date;

  @Column('timestamp')
  updatedAt: Date;
}
