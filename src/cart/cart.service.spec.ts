import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { ProductService } from '../product/product.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<Cart>;
  let cartItemRepository: Repository<CartItem>;
  let productService: ProductService;

  const mockCartRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCartItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockProductService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepository,
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: mockCartItemRepository,
        },
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    cartItemRepository = module.get<Repository<CartItem>>(getRepositoryToken(CartItem));
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCart', () => {
    it('should create an empty cart', async () => {
      const mockCart = { id: 1, items: [] };
      mockCartRepository.create.mockReturnValue(mockCart);
      mockCartRepository.save.mockResolvedValue(mockCart);

      const result = await service.createCart();

      expect(result).toEqual({ id: 1, items: [], total: 0 });
      expect(mockCartRepository.create).toHaveBeenCalledWith({ items: [] });
      expect(mockCartRepository.save).toHaveBeenCalledWith(mockCart);
    });
  });

  describe('addItem', () => {
    it('should add new item to cart', async () => {
      const mockCart = {
        id: 1,
        items: [],
      };

      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 100,
      };

      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockProductService.findOne.mockResolvedValue(mockProduct);
      mockCartItemRepository.create.mockReturnValue({
        cart: mockCart,
        product: mockProduct,
        quantity: 2,
      });

      const result = await service.addItem(1, 1, 2);

      expect(mockCartRepository.findOne).toHaveBeenCalled();
      expect(mockProductService.findOne).toHaveBeenCalled();
      expect(mockCartItemRepository.create).toHaveBeenCalled();
      expect(mockCartItemRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when cart not found', async () => {
      mockCartRepository.findOne.mockResolvedValue(null);

      await expect(service.addItem(1, 1, 2)).rejects.toThrow(NotFoundException);
    });

    it('should update quantity if item already exists', async () => {
      const existingItem = {
        product: { id: 1, name: 'Test Product', price: 100 },
        quantity: 1,
      };

      const mockCart = {
        id: 1,
        items: [existingItem],
      };

      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockProductService.findOne.mockResolvedValue(existingItem.product);

      await service.addItem(1, 1, 2);

      expect(existingItem.quantity).toBe(3);
      expect(mockCartItemRepository.save).toHaveBeenCalledWith(existingItem);
    });
  });

  describe('updateItemQuantity', () => {
    it('should update item quantity', async () => {
      const mockCart = {
        id: 1,
        items: [
          {
            product: { id: 1, name: 'Test Product', price: 100, stock: 5 },
            quantity: 1,
          },
        ],
      };

      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockProductService.findOne.mockResolvedValue({ ...mockCart.items[0].product });

      await service.updateItemQuantity(1, 1, 3);

      expect(mockCart.items[0].quantity).toBe(3);
      expect(mockCartItemRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when quantity exceeds stock', async () => {
      const mockCart = {
        id: 1,
        items: [
          {
            product: { id: 1, name: 'Test Product', price: 100, stock: 2 },
            quantity: 1,
          },
        ],
      };

      mockCartRepository.findOne.mockResolvedValue(mockCart);
      mockProductService.findOne.mockResolvedValue({ ...mockCart.items[0].product });

      await expect(service.updateItemQuantity(1, 1, 3)).rejects.toThrow(BadRequestException);
    });
  });
}); 