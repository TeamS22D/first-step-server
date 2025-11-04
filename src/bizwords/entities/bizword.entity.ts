// src/bizwords/entities/bizword.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Bizword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;

  @Column('simple-json') 
  desc: string[];

  @Column({ type: 'text'})
  example: string;

  @Column({ type: 'text' }) 
  desc_searchable: string;
}