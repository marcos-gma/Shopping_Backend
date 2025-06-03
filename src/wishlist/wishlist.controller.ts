import { Controller, Post, Get, Delete, Param, HttpCode } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  createWishlist() {
    return this.wishlistService.createWishlist();
  }

  @Get(':id')
  getWishlist(@Param('id') id: string) {
    return this.wishlistService.getWishlist(+id);
  }

  @Post(':id/products/:productId')
  addToWishlist(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.addToWishlist(+id, +productId);
  }

  @Delete(':id/products/:productId')
  @HttpCode(204)
  removeFromWishlist(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(+id, +productId);
  }

  @Get(':id/products/:productId')
  isProductInWishlist(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.isProductInWishlist(+id, +productId);
  }
} 