import {
    Column,
    BeforeInsert,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Bizword } from 'src/bizwords/entities/bizword.entity';

@Entity({name: 'users'})
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

    @ManyToMany(() => Bizword)
    @JoinTable({ name: 'user_favorites' })
    favorites: Bizword[];

    @BeforeInsert()
    private before() {
        if (this.password) {
            this.password = bcrypt.hashSync(this.password, 10);
        }
    }
}