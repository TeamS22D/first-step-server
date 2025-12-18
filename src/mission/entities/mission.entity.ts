import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rubric } from '../../rubric/entities/rubric.entity';
import { UserMission } from '../../user-mission/entities/user-mission.entity';
import { MissionTheme } from '../types/missoin-theme.enum';

@Entity({ name: 'mission' })
export class Mission {
  @PrimaryGeneratedColumn()
  missionId: number;

  @ManyToOne(() => Rubric, (rubric) => rubric.missions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'rubric_id' })
  rubric: Rubric;

  @OneToMany(() => UserMission, (user_mission) => user_mission.mission)
  userMissions: UserMission[];

  @Column({ nullable: false })
  missionName: string;

  @Column({
    type: 'enum',
    enum: MissionTheme,
    default: MissionTheme.DOCUMENT,
  })
  missionTheme: MissionTheme;

  @Column({ type: 'text', nullable: false })
  body: string;

  @Column({ type: 'text', nullable: true })
  situation: string;

  @Column({ type: 'text', nullable: true })
  tip: string;

  @Column({ type: 'text', nullable: true })
  requirement: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'text', nullable: true })
  referenceAnswer?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ name: 'ai_persona_name', nullable: true })
  personaName: string;

  @Column({ name: 'ai_persona_role', nullable: true })
  personaRole: string;

  @Column({ name: 'ai_persona_character', nullable: true })
  personaCharacter: string;

  // @Column({ name: 'ai_persona_prompt', nullable: true, type: 'text' })
  // aiPersonaPrompt: string;
  //
  // @Column({ name: 'evaluation_guideline', nullable: true, type: 'text' })
  // evaluationGuideline: string;
  //
  // @Column({ name: 'example_conversations_file', nullable: true, type: 'text' })
  // example_conversations_file: string;
}
