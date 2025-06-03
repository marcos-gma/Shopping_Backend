import { Exclude, Expose, Type } from 'class-transformer';

class WishlistProductResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  stock: number;

  constructor(partial: Partial<WishlistProductResponse>) {
    Object.assign(this, partial);
  }
}

export class WishlistResponse {
  @Expose()
  id: number;

  @Expose()
  @Type(() => WishlistProductResponse)
  products: WishlistProductResponse[];

  @Exclude()
  createdAt: Date;

  constructor(partial: Partial<WishlistResponse>) {
    Object.assign(this, partial);
  }
} 