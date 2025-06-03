import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;
} 