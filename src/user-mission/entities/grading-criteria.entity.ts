import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GradingResult } from './grading-result.entity';
import { Feedback } from './feedback.entity';

@Entity({ name: 'grading_criteria' })
export class GradingCriteriaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  index: number;

  @Column()
  item: string; // 세부평가항목의 이름

  @Column()
  score: number;

  @Column({ name: 'max_score' })
  maxScore: number;

  @Column(() => Feedback)
  feedback: Feedback;

  @ManyToOne(
    () => GradingResult,
    (gradingResult) => gradingResult.gradingCriterias,
  )
  @JoinColumn({ name: 'grading_result_id' })
  gradingResult: GradingResult;
}
