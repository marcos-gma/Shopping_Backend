import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';
import { CartItem } from '../cart/cart-item.entity';
import { OrderItem } from '../order/order-item.entity';
import { Wishlist } from '../wishlist/wishlist.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { active: true }
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id } 
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async search(term: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: [
        { name: Like(`%${term}%`), active: true },
        { description: Like(`%${term}%`), active: true },
      ],
    });
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.findOne(id); // Verifica se o produto existe
    await this.productRepository.update(id, productData);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    
    // Remove de carrinhos
    const cartItems = await this.cartItemRepository.find({
      where: { product: { id } }
    });
    if (cartItems.length > 0) {
      await this.cartItemRepository.remove(cartItems);
    }

    // Remove de wishlists
    const wishlists = await this.wishlistRepository.find({
      relations: ['products']
    });

    for (const wishlist of wishlists) {
      wishlist.products = wishlist.products.filter(p => p.id !== id);
      await this.wishlistRepository.save(wishlist);
    }

    // Verifica se está em pedidos
    const orderItems = await this.orderItemRepository.find({
      where: { product: { id } }
    });

    if (orderItems.length > 0) {
      // Em vez de deletar, marca como inativo
      await this.productRepository.update(id, { 
        active: false,
        stock: 0  // Zera o estoque também
      });
      return;
    }

    // Se não está em pedidos, pode deletar
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
} 