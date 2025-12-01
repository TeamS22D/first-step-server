import { Mission } from "src/mission/entities/mission.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'email_mission' })
export class EmailMission {
    @PrimaryGeneratedColumn()
    emailMissionId: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    sender: string;

    @Column()
    SendAt: Date;

    @Column()
    emailContent: string;

    @OneToOne(() => Mission, mission => mission.missionId)
    @JoinColumn({ name: 'missionId' })
    mission: Mission;
}