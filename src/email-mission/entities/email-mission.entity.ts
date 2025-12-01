import { Mission } from "src/mission/entities/mission.entity";
import { UserMission } from "src/user-mission/entities/user-mission.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'email_mission' })
export class EmailMission {
    @PrimaryGeneratedColumn()
    emailMissionId: number;

    @Column({ nullable: false })
    title: string;

    @Column()
    SendAt: Date;

    @Column({ nullable: true })
    emailContent: string;

    @OneToOne(() => Mission, mission => mission.missionId)
    @JoinColumn({ name: 'mission_id' })
    mission: Mission;

    @ManyToMany(() => UserMission, userMission => userMission.userMissionId)
    userMission: UserMission;
}