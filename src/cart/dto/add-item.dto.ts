import { IsNumber, Min } from 'class-validator';

export class AddItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1)
  quantity: number;
} 