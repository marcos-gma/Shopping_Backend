import { Module } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shopping } from './shopping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shopping])],
  controllers: [ShoppingController],
  providers: [ShoppingService]
})
export class ShoppingModule {}
