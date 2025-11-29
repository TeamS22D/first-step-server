import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GradingResult } from './grading-result.entity';

@Entity({ name: 'grading_criteria' })
export class GradingCriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  index: number;

  @Column()
  score: number;

  @Column({ name: 'max_score' })
  maxScore: number;

  @ManyToOne(() => GradingResult, (gradingResult) => gradingResult.gradingCriterias)
  @JoinColumn({ name: 'grading_result_id' })
  gradingResult: GradingResult;
}
