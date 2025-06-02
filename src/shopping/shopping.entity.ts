import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Shopping {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    title: string;


    @Column({ default: false })
    completed: boolean;
}