import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Mission } from '../../mission/entities/mission.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { GradingResult } from './grading-result.entity';

//TODO: userMission status 추가
@Entity({ name: 'users_missions' })
export class UserMission {
  @PrimaryGeneratedColumn()
  userMissionId: number;

  @ManyToOne(() => Mission, (mission) => mission.userMissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mission_id' })
  mission: Mission;

  @Column({ type: 'text', nullable: true })
  answer?: string | null;

  @ManyToOne(() => UserEntity, (user) => user.userMissions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne(() => GradingResult, (gradingResult) => gradingResult.userMission, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'grading_result_id' })
  gradingResult: GradingResult;
// db삭제하고 다시 만들어봅시다잉
  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
