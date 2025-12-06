import { Column } from 'typeorm';

export class Feedback {
  @Column({ nullable: true })
  goodPoints: string;

  @Column({ nullable: true })
  improvementPoints: string;

  @Column({ nullable: true })
  suggestedFix: string;
}