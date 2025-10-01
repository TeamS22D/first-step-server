import {
    Column,
    BeforeInsert,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

@Entity({name: 'user'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    password : string;

    @Column()
    email: string;

    @Column( { type: 'timestamp', nullable: true })
    expirationTime: Date;

    @Column({ nullable: true })
    verificationCode?: string;

    @BeforeInsert()
    private before() {
        this.password = bcrypt.hashSync(this.password, 10);
    }
}