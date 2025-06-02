import { Entity, PrimaryGeneratedColumn, OneToMany, Column, CreateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, {
    cascade: true,
    eager: true
  })
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;
} 