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

    @Column({ nullable: true })
    password: string;

    @Column()
    email: string;

    @Column({ default: false, nullable: true })
    isVerified: boolean;

    @Column({ nullable: true })
    refreshToken: string;

    @BeforeInsert()
    private before() {
        this.password = bcrypt.hashSync(this.password, 10);
    }
}