import { Exclude, Expose, Type } from 'class-transformer';

class CartItemResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;

  @Expose()
  total: number;

  constructor(partial: Partial<CartItemResponse>) {
    Object.assign(this, partial);
  }
}

export class CartResponse {
  @Expose()
  id: number;

  @Expose()
  @Type(() => CartItemResponse)
  items: CartItemResponse[];

  @Expose()
  total: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<CartResponse>) {
    Object.assign(this, partial);
  }
} 