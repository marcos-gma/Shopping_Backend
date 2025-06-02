import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
  ) {}

  async createOrder(cartId: number): Promise<Order> {
    const cart = await this.cartService.getCart(cartId);
    if (!cart.items.length) {
      throw new NotFoundException('Cart is empty');
    }

    const total = await this.cartService.calculateTotal(cartId);
    
    const order = this.orderRepository.create({
      total,
      items: cart.items.map(cartItem => this.orderItemRepository.create({
        product: cartItem.product,
        quantity: cartItem.quantity,
        price: cartItem.product.price,
      })),
    });

    await this.orderRepository.save(order);
    await this.cartService.clearCart(cartId);

    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
} 