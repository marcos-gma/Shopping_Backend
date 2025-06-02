import { Test, TestingModule } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shopping } from './shopping.entity';

@Injectable()
export class ShoppingService {
    constructor(
        @InjectRepository(Shopping)
        private shoppingRepository: Repository<Shopping>
    ){}

    
}
