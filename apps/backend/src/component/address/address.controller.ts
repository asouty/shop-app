import { Body, Controller, Put } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { AddressEntity } from '../../model/address.entity';

@Controller('address')
@ApiBearerAuth()
export class AddressController {
  constructor(private readonly service: AddressService) {}
  @Put()
  public async upsert(@Body() address: AddressEntity) {
    await this.service.upsert(address);
  }
}
