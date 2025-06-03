import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Product } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Product])],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {} 