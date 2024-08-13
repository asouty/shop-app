import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AddressEntity } from './address.entity';
import { ItemEntity } from './item.entity';

@Entity({ name: 'person' })
export class PersonEntity extends BaseEntity {
  constructor() {
    super();
    this.id = '';
  }

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ nullable: true })
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  lastname: string;

  @ApiProperty({ type: () => AddressEntity })
  @OneToMany(() => AddressEntity, (address) => address.person)
  addresses: AddressEntity[];

  @ApiProperty({ type: () => ItemEntity })
  @ManyToMany(() => ItemEntity)
  @JoinTable({
    name: 'persons_items_cart', // table name for the junction table of this relation
    joinColumn: {
      name: 'person',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'item',
      referencedColumnName: 'id',
    },
  })
  cartItems: ItemEntity[];

  public isStoredInDatabase() {
    return this.id.length != 0;
  }
}
