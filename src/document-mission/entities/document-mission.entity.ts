import { UserMission } from "../../user-mission/entities/user-mission.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'document_missions' })
export class DocumentMission {
    @PrimaryGeneratedColumn()
    documentMissionId: number;

    @Column({ nullable: true })
    sendAt: Date;

    @Column({ nullable: true })
    saveAt: Date;

    @Column({ default: false })
    isSend: boolean;

    @Column({ nullable: true })
    documentContent: string;

    @OneToOne(() => UserMission, userMission => userMission.documentMission)
    @JoinColumn({ name: 'user_mission_id' })
    userMission: UserMission;
}