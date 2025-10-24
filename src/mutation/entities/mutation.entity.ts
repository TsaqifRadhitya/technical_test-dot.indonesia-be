import { User } from "../../user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, } from "typeorm";
@Entity()
export class Mutation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    amount: number

    @Column()
    transaction_type: "deposit" | "withdraw"

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(() => User, (user) => user.mutations)
    @JoinColumn({ name: "user_id" })
    user: User
}
