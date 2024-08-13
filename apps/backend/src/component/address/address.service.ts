import { Injectable } from '@nestjs/common';
import { AddressEntity } from '../../model/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly repository: Repository<AddressEntity>,
  ) {}
  public async upsert(address: AddressEntity) {
    if (address.id) {
      await this.repository.update(address.id, address);
      return;
    }
    await this.repository.save(this.repository.create(address));
  }
}
