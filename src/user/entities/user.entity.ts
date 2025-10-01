import {
    Column,
    BeforeInsert,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

// @Entity({name: 'userss'})
@Entity({name: 'user'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column({nullable: true})
    password : string;

    @Column({unique: true})
    email: string;

    @Column({ type: 'enum', enum: ['email', 'google', 'kakao', 'naver'], default: 'email'})
    provider: 'email' | 'google' | 'kakao' | 'naver';

    @BeforeInsert()
    private before() {
        if (this.password) {
            this.password = bcrypt.hashSync(this.password, 10);
        }
    }
}