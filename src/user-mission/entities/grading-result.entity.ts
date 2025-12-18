import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserMission } from './user-mission.entity';
import { GradingCriteriaEntity } from './grading-criteria.entity';
import { Mission } from '../../mission/entities/mission.entity';
import { UserEntity } from '../../user/entities/user.entity';

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

  @Column({ name: 'internal_note', nullable: true })
  internalNote: string;

  @OneToOne(() => UserMission, (userMission) => userMission.gradingResult, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_mission_id' })
  userMission: UserMission;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.gradingResults, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(
    () => GradingCriteriaEntity,
    (gradingCriteria) => gradingCriteria.gradingResult,
  )
  gradingCriterias: GradingCriteriaEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
