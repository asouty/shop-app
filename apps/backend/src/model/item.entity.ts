import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PersonEntity } from './person.entity';

@Entity({ name: 'item' })
export class ItemEntity extends BaseEntity {
  @Column()
  @ApiProperty()
  idExternal: string;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  description: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];

  @ApiProperty({ type: () => PersonEntity })
  @ManyToMany(() => PersonEntity)
  @JoinTable({
    name: 'persons_items_cart',
    joinColumn: {
      name: 'item',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'person',
      referencedColumnName: 'id',
    },
  })
  cartPersons: PersonEntity[];
}
