import { Column } from 'typeorm';

export class Feedback {
  @Column({ name: 'good_points', nullable: true })
  goodPoints: string;

  @Column({ name: 'improvement_points', nullable: true })
  improvementPoints: string;

  @Column({ name: 'suggested_fix', nullable: true })
  suggestedFix: string;
}