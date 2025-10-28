import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Bizword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  term: string;

  @Column({ default: '' })
  meaning: string;

  @Column({ nullable: true })
  example?: string;
}