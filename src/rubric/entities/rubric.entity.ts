import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Mission } from '../../mission/entities/mission.entity';

@Entity({ name: 'rubrics' })
export class Rubric {
  @PrimaryGeneratedColumn()
  rubricId: number;

  @Column()
  rubricName: string;

  @Column()
  body: string;

  @OneToMany(() => Mission, (mission) => mission.rubric)
  missions: Mission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
