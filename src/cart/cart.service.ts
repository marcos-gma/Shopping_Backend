import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from '../product/product.entity';
import { ProductService } from '../product/product.service';
import { CartResponse } from './dto/cart-response.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
  ) {}

  private toCartResponse(cart: Cart): CartResponse {
    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return plainToClass(CartResponse, {
      id: cart.id,
      items: cart.items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity
      })),
      total
    }, { excludeExtraneousValues: true });
  }

  async createCart(): Promise<CartResponse> {
    const cart = this.cartRepository.create({ items: [] });
    const savedCart = await this.cartRepository.save(cart);
    return this.toCartResponse(savedCart);
  }

  async getCart(id: number): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return this.toCartResponse(cart);
  }

  async addItem(cartId: number, productId: number, quantity: number): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

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

    return this.toCartResponse(cart);
  }

  async removeItem(cartId: number, productId: number): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    const cartItem = cart.items.find(item => item.product.id === productId);

    if (!cartItem) {
      throw new NotFoundException(`Product ${productId} not found in cart ${cartId}`);
    }

    await this.cartItemRepository.remove(cartItem);
    cart.items = cart.items.filter(item => item.product.id !== productId);
    
    return this.toCartResponse(cart);
  }

  async updateItemQuantity(cartId: number, productId: number, quantity: number): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    const cartItem = cart.items.find(item => item.product.id === productId);

    if (!cartItem) {
      throw new NotFoundException(`Product ${productId} not found in cart ${cartId}`);
    }

    if (quantity <= 0) {
      return this.removeItem(cartId, productId);
    }

    const product = await this.productService.findOne(productId);
    if (product.stock < quantity) {
      throw new BadRequestException(`Not enough stock. Available: ${product.stock}`);
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);

    return this.toCartResponse(cart);
  }

  async clearCart(cartId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    await this.cartItemRepository.remove(cart.items);
    cart.items = [];
  }

  async calculateTotal(cartId: number): Promise<number> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }
} 