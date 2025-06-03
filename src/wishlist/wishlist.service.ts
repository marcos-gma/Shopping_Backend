import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createWishlist(): Promise<Wishlist> {
    const wishlist = this.wishlistRepository.create({ products: [] });
    return await this.wishlistRepository.save(wishlist);
  }

  async getWishlist(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    return wishlist;
  }

  async addToWishlist(wishlistId: number, productId: number): Promise<Wishlist> {
    const wishlist = await this.getWishlist(wishlistId);
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (!wishlist.products.some(p => p.id === productId)) {
      wishlist.products.push(product);
      await this.wishlistRepository.save(wishlist);
    }

    return wishlist;
  }

  async removeFromWishlist(wishlistId: number, productId: number): Promise<Wishlist> {
    const wishlist = await this.getWishlist(wishlistId);
    wishlist.products = wishlist.products.filter(product => product.id !== productId);
    return await this.wishlistRepository.save(wishlist);
  }

  async isProductInWishlist(wishlistId: number, productId: number): Promise<boolean> {
    const wishlist = await this.getWishlist(wishlistId);
    return wishlist.products.some(product => product.id === productId);
  }
} 