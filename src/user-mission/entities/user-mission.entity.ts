import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Mission } from '../../mission/entities/mission.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { GradingResult } from './grading-result.entity';
import { EmailMission } from 'src/email-mission/entities/email-mission.entity';

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

  @Column({ type: 'text', nullable: true })
  answer?: string | null;

  @ManyToOne(() => UserEntity, (user) => user.userMissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => GradingResult, (gradingResult) => gradingResult.userMission)
  gradingResults: GradingResult[];

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => EmailMission, emailMission => emailMission.emailMissionId)
  EmailMisison: number;
}
