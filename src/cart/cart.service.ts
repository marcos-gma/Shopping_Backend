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

  async createCart(): Promise<Cart> {
    const cart = this.cartRepository.create({ items: [] });
    return await this.cartRepository.save(cart);
  }

  async getCart(id: number): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const response = plainToClass(CartResponse, {
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

    return response;
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
    const cartItem = cart.items.find(item => item.product.id === productId);

    if (!cartItem) {
      throw new NotFoundException(`Product ${productId} not found in cart ${cartId}`);
    }

    await this.cartItemRepository.remove(cartItem);
    
    return this.getCart(cartId); // Recarrega o carrinho para ter certeza que está atualizado
  }

  async updateItemQuantity(cartId: number, productId: number, quantity: number): Promise<Cart> {
    const cart = await this.getCart(cartId);
    const cartItem = cart.items.find(item => item.product.id === productId);

    if (!cartItem) {
      throw new NotFoundException(`Product ${productId} not found in cart ${cartId}`);
    }

    if (quantity <= 0) {
      // Se a quantidade for 0 ou menor, remove o item
      return this.removeItem(cartId, productId);
    }

    // Verifica se há estoque suficiente
    const product = await this.productService.findOne(productId);
    if (product.stock < quantity) {
      throw new BadRequestException(`Not enough stock. Available: ${product.stock}`);
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);

    return this.getCart(cartId); // Recarrega o carrinho para ter certeza que está atualizado
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