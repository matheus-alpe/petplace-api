import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}
