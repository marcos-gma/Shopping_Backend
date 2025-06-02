import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  createCart() {
    return this.cartService.createCart();
  }

  @Get(':id')
  getCart(@Param('id') id: string) {
    return this.cartService.getCart(+id);
  }

  @Post(':id/items')
  addItem(
    @Param('id') id: string,
    @Body() addItemDto: AddItemDto,
  ) {
    return this.cartService.addItem(+id, addItemDto.productId, addItemDto.quantity);
  }

  @Delete(':id/items/:productId')
  removeItem(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(+id, +productId);
  }

  @Put(':id/items/:productId')
  updateItemQuantity(
    @Param('id') id: string,
    @Param('productId') productId: string,
    @Body() addItemDto: AddItemDto,
  ) {
    return this.cartService.updateItemQuantity(+id, +productId, addItemDto.quantity);
  }

  @Delete(':id')
  clearCart(@Param('id') id: string) {
    return this.cartService.clearCart(+id);
  }

  @Get(':id/total')
  getTotal(@Param('id') id: string) {
    return this.cartService.calculateTotal(+id);
  }
} 