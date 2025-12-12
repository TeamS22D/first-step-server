import { Mission } from "src/mission/entities/mission.entity";
import { UserMission } from "src/user-mission/entities/user-mission.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'email_missions' })
export class EmailMission {
    @PrimaryGeneratedColumn()
    emailMissionId: number;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    sendAt: Date;

    @Column({ nullable: true })
    saveAt: Date;

    @Column({ default: false })
    isSend: boolean;

    @Column({ nullable: true })
    emailContent: string;

    @OneToOne(() => UserMission, userMission => userMission.userMissionId)
    @JoinColumn({ name: 'user_mission_id' })
    userMission: UserMission;
}