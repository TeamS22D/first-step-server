import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Mission } from './mission.entity';

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

  @Column('datetime')
  createdAt: Date;

  @Column('timestamp')
  updatedAt: Date;
}
