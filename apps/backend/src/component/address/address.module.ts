import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from '../../model/address.entity';
import { PersonEntity } from '../../model/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity, PersonEntity])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
