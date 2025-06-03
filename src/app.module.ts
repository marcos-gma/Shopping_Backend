import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { Product } from './product/product.entity';
import { Cart } from './cart/cart.entity';
import { CartItem } from './cart/cart-item.entity';
import { Order } from './order/order.entity';
import { OrderItem } from './order/order-item.entity';
import { Wishlist } from './wishlist/wishlist.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'shopping.db',
      entities: [Product, Cart, CartItem, Order, OrderItem, Wishlist],
      synchronize: true, // Não use em produção!
    }),
    ProductModule,
    CartModule,
    OrderModule,
    WishlistModule,
  ],
})
export class AppModule {}
