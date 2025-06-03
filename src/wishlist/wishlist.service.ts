import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Wishlist } from './wishlist.entity';
import { Product } from '../product/product.entity';
import { WishlistResponse } from './dto/wishlist-response.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Formata wishlist para retorno com dados relevantes dos produtos
  private toWishlistResponse(wishlist: Wishlist): WishlistResponse {
    return plainToClass(WishlistResponse, {
      id: wishlist.id,
      products: wishlist.products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock
      }))
    }, { excludeExtraneousValues: true });
  }

  async createWishlist(): Promise<WishlistResponse> {
    const wishlist = this.wishlistRepository.create({ products: [] });
    const savedWishlist = await this.wishlistRepository.save(wishlist);
    return this.toWishlistResponse(savedWishlist);
  }

  async getWishlist(id: number): Promise<WishlistResponse> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    return this.toWishlistResponse(wishlist);
  }

  async addToWishlist(wishlistId: number, productId: number): Promise<WishlistResponse> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: wishlistId },
      relations: ['products'],
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${wishlistId} not found`);
    }

    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Evita duplicatas na lista de desejos
    if (!wishlist.products.some(p => p.id === productId)) {
      wishlist.products.push(product);
      await this.wishlistRepository.save(wishlist);
    }

    return this.toWishlistResponse(wishlist);
  }

  async removeFromWishlist(wishlistId: number, productId: number): Promise<WishlistResponse> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: wishlistId },
      relations: ['products'],
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${wishlistId} not found`);
    }

    wishlist.products = wishlist.products.filter(product => product.id !== productId);
    const savedWishlist = await this.wishlistRepository.save(wishlist);
    return this.toWishlistResponse(savedWishlist);
  }

  async isProductInWishlist(wishlistId: number, productId: number): Promise<boolean> {
    const wishlist = await this.getWishlist(wishlistId);
    return wishlist.products.some(product => product.id === productId);
  }
} 