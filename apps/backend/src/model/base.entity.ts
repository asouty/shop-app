import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({ readOnly: true })
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ readOnly: true })
  @CreateDateColumn({ name: 'created_at' })
  createDateTime: Date;

  @ApiProperty({ readOnly: true })
  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({ name: 'updated_at' })
  lastChangedDateTime: Date;

  @ApiProperty({ readOnly: true })
  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;
}
