import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CartItem } from '../cart/cart-item.entity';
import { OrderItem } from '../order/order-item.entity';
import { Wishlist } from '../wishlist/wishlist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, CartItem, OrderItem, Wishlist])
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {} 