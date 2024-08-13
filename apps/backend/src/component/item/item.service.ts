// item.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from '../../model/item.entity';
import { RepositoryService } from '../../util/repository.files';
import * as path from 'path';
@Injectable()
export class ItemService extends RepositoryService {
  private directory: string;
  constructor(
    @InjectRepository(ItemEntity)
    private readonly repository: Repository<ItemEntity>,
  ) {
    super();
    this.directory = 'image';
  }

  public async getAll() {
    const items = await this.repository.find();
    for (const item of items) {
      item.images = await this.loadImages(item);
    }
    return items;
  }

  public async add(item: ItemEntity) {
    const savedItem = await this.repository.save(this.repository.create(item));
    if (item.images) {
      for (let i = 0; i < item.images.length; i++) {
        await this.writeJpegFile(
          this.getPath(savedItem.id),
          'image' + i + '.jpg',
          item.images[i],
        );
      }
    }
    return savedItem;
  }

  public async getImageFiles(id: string) {
    return this.getFiles(this.getPath(id));
  }

  private getPath(...paths: string[]) {
    return path.join(this.directory, ...paths);
  }

  private async loadImages(item: ItemEntity) {
    const imageContents = [];
    for (const imageFile of await this.getImageFiles(item.id)) {
      imageContents.push(
        await this.readJpegFile(this.getPath(item.id, imageFile)),
      );
    }
    return imageContents;
  }
}
