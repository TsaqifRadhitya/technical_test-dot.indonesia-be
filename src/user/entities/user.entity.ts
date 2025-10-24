import { Session } from "../../auth/entities/session.entity";
import { Mutation } from "../../mutation/entities/mutation.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @DeleteDateColumn()
    deletedAt?: Date;

    @OneToMany(() => Mutation, (mutation) => mutation.user)
    mutations: Mutation[]

    @OneToMany(() => Session, (session) => session.user)
    sessions: Session[]
}
