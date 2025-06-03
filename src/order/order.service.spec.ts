import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let cartService: CartService;
  let productService: ProductService;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockOrderItemRepository = {
    create: jest.fn(),
  };

  const mockCartService = {
    getCart: jest.fn(),
    calculateTotal: jest.fn(),
    clearCart: jest.fn(),
  };

  const mockProductService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        {
          provide: CartService,
          useValue: mockCartService,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    cartService = module.get<CartService>(CartService);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order from cart', async () => {
      const mockCart = {
        id: 1,
        items: [
          {
            id: 1,
            name: 'Test Product',
            price: 100,
            quantity: 2,
          },
        ],
      };

      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 100,
      };

      const mockOrder = {
        id: 1,
        total: 200,
        items: [
          {
            product: mockProduct,
            quantity: 2,
            price: 100,
          },
        ],
      };

      mockCartService.getCart.mockResolvedValue(mockCart);
      mockCartService.calculateTotal.mockResolvedValue(200);
      mockProductService.findOne.mockResolvedValue(mockProduct);
      mockOrderItemRepository.create.mockReturnValue(mockOrder.items[0]);
      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);

      const result = await service.createOrder(1);

      expect(result).toEqual(mockOrder);
      expect(mockCartService.getCart).toHaveBeenCalledWith(1);
      expect(mockCartService.calculateTotal).toHaveBeenCalledWith(1);
      expect(mockCartService.clearCart).toHaveBeenCalledWith(1);
      expect(mockOrderRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException for empty cart', async () => {
      mockCartService.getCart.mockResolvedValue({ id: 1, items: [] });

      await expect(service.createOrder(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all orders with relations', async () => {
      const mockOrders = [
        {
          id: 1,
          total: 200,
          items: [
            {
              product: { id: 1, name: 'Test Product' },
              quantity: 2,
              price: 100,
            },
          ],
        },
      ];

      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.findAll();

      expect(result).toEqual(mockOrders);
      expect(mockOrderRepository.find).toHaveBeenCalledWith({
        relations: ['items', 'items.product'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return order by id', async () => {
      const mockOrder = {
        id: 1,
        total: 200,
        items: [
          {
            product: { id: 1, name: 'Test Product' },
            quantity: 2,
            price: 100,
          },
        ],
      };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(result).toEqual(mockOrder);
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['items', 'items.product'],
      });
    });

    it('should throw NotFoundException when order not found', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
}); 