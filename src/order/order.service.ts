import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async createOrder(cartId: number): Promise<Order> {
    const cart = await this.cartService.getCart(cartId);
    if (!cart.items.length) {
      throw new NotFoundException('Cart is empty');
    }

    const total = await this.cartService.calculateTotal(cartId);
    
    // Cria itens do pedido a partir do carrinho
    const orderItems = await Promise.all(
      cart.items.map(async (cartItem) => {
        const product = await this.productService.findOne(cartItem.id);
        return this.orderItemRepository.create({
          product,
          quantity: cartItem.quantity,
          price: cartItem.price,
        });
      })
    );

    // Salva pedido e limpa carrinho
    const order = this.orderRepository.create({
      total,
      items: orderItems,
    });

    await this.orderRepository.save(order);
    await this.cartService.clearCart(cartId);

    return order;
  }

  // Retorna pedidos ordenados do mais recente pro mais antigo
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