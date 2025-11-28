import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserMission } from './user-mission.entity';

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

  @Column()
  userId: number;

  @Column()
  missionId: number;
}
