import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserMissionEntity } from './userMission.entity';

@Entity({ name: 'missions' })
export class MissionEntity {
  @PrimaryGeneratedColumn()
  mission_id: number;

  @OneToMany(() => UserMissionEntity, userMission => userMission.mission)
  userMissions: UserMissionEntity[];

  @Column({ nullable: false })
  mission_name: string;

  @Column({ nullable: false })
  mission_theme: string;

  @Column()
  description: string;

}
