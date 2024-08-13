import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PersonEntity } from './person.entity';

@Entity({ name: 'address_' })
export class AddressEntity extends BaseEntity {
  @Column()
  @ApiProperty()
  street: string;

  @Column()
  @ApiProperty()
  city: string;

  @Column()
  @ApiProperty()
  postcode: string;

  @Column()
  @ApiProperty()
  country: string;

  @ApiProperty({ type: () => PersonEntity })
  @ManyToOne(() => PersonEntity, (person) => person.addresses)
  person: PersonEntity;
}
