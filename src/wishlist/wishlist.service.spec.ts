import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistService } from './wishlist.service';
import { Wishlist } from './wishlist.entity';
import { Product } from '../product/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('WishlistService', () => {
  let service: WishlistService;
  let wishlistRepository: Repository<Wishlist>;
  let productRepository: Repository<Product>;

  const mockWishlistRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: getRepositoryToken(Wishlist),
          useValue: mockWishlistRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    wishlistRepository = module.get<Repository<Wishlist>>(getRepositoryToken(Wishlist));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWishlist', () => {
    it('should create empty wishlist', async () => {
      const mockWishlist = { id: 1, products: [] };
      mockWishlistRepository.create.mockReturnValue(mockWishlist);
      mockWishlistRepository.save.mockResolvedValue(mockWishlist);

      const result = await service.createWishlist();

      expect(result).toEqual({ id: 1, products: [] });
      expect(mockWishlistRepository.create).toHaveBeenCalledWith({ products: [] });
      expect(mockWishlistRepository.save).toHaveBeenCalledWith(mockWishlist);
    });
  });

  describe('getWishlist', () => {
    it('should return wishlist by id', async () => {
      const mockWishlist = {
        id: 1,
        products: [
          {
            id: 1,
            name: 'Test Product',
            price: 100,
            stock: 10,
          },
        ],
      };

      mockWishlistRepository.findOne.mockResolvedValue(mockWishlist);

      const result = await service.getWishlist(1);

      expect(result).toEqual({
        id: 1,
        products: [
          {
            id: 1,
            name: 'Test Product',
            price: 100,
            stock: 10,
          },
        ],
      });
      expect(mockWishlistRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['products'],
      });
    });

    it('should throw NotFoundException when wishlist not found', async () => {
      mockWishlistRepository.findOne.mockResolvedValue(null);

      await expect(service.getWishlist(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addToWishlist', () => {
    it('should add product to wishlist', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 100,
        stock: 10,
      };

      const mockWishlist = {
        id: 1,
        products: [],
      };

      mockWishlistRepository.findOne.mockResolvedValue(mockWishlist);
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockWishlistRepository.save.mockImplementation(async (wishlist) => wishlist);

      const result = await service.addToWishlist(1, 1);

      expect(mockWishlistRepository.findOne).toHaveBeenCalled();
      expect(mockProductRepository.findOne).toHaveBeenCalled();
      expect(mockWishlistRepository.save).toHaveBeenCalled();
      expect(result.products).toContainEqual(mockProduct);
    });

    it('should not add duplicate product to wishlist', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 100,
        stock: 10,
      };

      const mockWishlist = {
        id: 1,
        products: [mockProduct],
      };

      mockWishlistRepository.findOne.mockResolvedValue(mockWishlist);
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockWishlistRepository.save.mockImplementation(async (wishlist) => wishlist);

      const result = await service.addToWishlist(1, 1);

      expect(result.products).toHaveLength(1);
      expect(result.products[0]).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      const mockWishlist = {
        id: 1,
        products: [],
      };

      mockWishlistRepository.findOne.mockResolvedValue(mockWishlist);
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.addToWishlist(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove product from wishlist', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 100,
        stock: 10,
      };

      const mockWishlist = {
        id: 1,
        products: [mockProduct],
      };

      mockWishlistRepository.findOne.mockResolvedValue(mockWishlist);
      mockWishlistRepository.save.mockImplementation(async (wishlist) => wishlist);

      const result = await service.removeFromWishlist(1, 1);

      expect(result.products).toHaveLength(0);
      expect(mockWishlistRepository.save).toHaveBeenCalled();
    });
  });
}); 