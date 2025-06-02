import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from '../product/product.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
  ) {}

  async createCart(): Promise<Cart> {
    const cart = this.cartRepository.create({ items: [] });
    return await this.cartRepository.save(cart);
  }

  async getCart(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  async addItem(cartId: number, productId: number, quantity: number): Promise<Cart> {
    const cart = await this.getCart(cartId);
    const product = await this.productService.findOne(productId);

    let cartItem = cart.items.find(item => item.product.id === productId);

    if (cartItem) {
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
      });
      cart.items.push(cartItem);
      await this.cartItemRepository.save(cartItem);
    }

    return cart;
  }

  async removeItem(cartId: number, productId: number): Promise<Cart> {
    const cart = await this.getCart(cartId);
    const itemIndex = cart.items.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      await this.cartItemRepository.remove(cart.items[itemIndex]);
      cart.items.splice(itemIndex, 1);
    }

    return cart;
  }

  async updateItemQuantity(cartId: number, productId: number, quantity: number): Promise<Cart> {
    const cart = await this.getCart(cartId);
    const cartItem = cart.items.find(item => item.product.id === productId);

    if (!cartItem) {
      throw new NotFoundException(`Product not found in cart`);
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);

    return cart;
  }

  async clearCart(cartId: number): Promise<void> {
    const cart = await this.getCart(cartId);
    await this.cartItemRepository.remove(cart.items);
  }

  async calculateTotal(cartId: number): Promise<number> {
    const cart = await this.getCart(cartId);
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }
} 