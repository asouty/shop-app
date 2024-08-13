import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemEntity } from '../../model/item.entity';
import { AliExpressService } from './ali-express.service';
import { CommonProvider } from './common.provider';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  providers: [ItemService, CommonProvider, AliExpressService],
  controllers: [ItemController],
})
export class ItemModule {}
