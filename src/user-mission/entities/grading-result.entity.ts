import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserMission } from './user-mission.entity';
import { GradingCriteria } from './grading-criteria';

@Entity({ name: 'grading_result' })
export class GradingResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'total_score' })
  totalScore: number;

  @Column({ name: 'grade' })
  grade: string; // 나중에 enum으로

  @Column({ name: 'summery_feedback', type: 'text' })
  summeryFeedback: string;

  @Column({ name: 'internal_note' })
  internalNote: string;

  @OneToOne(() => UserMission, (userMission) => userMission.gradingResult, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_mission_id' })
  userMission: UserMission;

  @OneToMany(
    () => GradingCriteria,
    (gradingCriteria) => gradingCriteria.gradingResult,
  )
  gradingCriterias: GradingCriteria[];

  @Column()
  userId: number;

  @Column()
  missionId: number;

  @CreateDateColumn()
  createdAt: Date;
}
