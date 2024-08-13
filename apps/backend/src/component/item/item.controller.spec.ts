import { Test, TestingModule } from '@nestjs/testing';
import { ItemController, UrlBody } from './item.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ItemService } from './item.service';
import { ItemEntity } from '../../model/item.entity';
import { TypeOrmSQLITETestingModule } from '../../../test/TypeORMSQLITETestingModule';
import { AliExpressService } from './ali-express.service';
import * as fs from 'fs/promises';
import { CommonProvider } from './common.provider';
import { PersonEntity } from '../../model/person.entity';
import { AddressEntity } from '../../model/address.entity';

jest.mock('../../../src/config/config.service', () => {
  return {
    configService: {
      getTypeOrmConfig: function (): TypeOrmModuleOptions {
        return {
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
      getJwtSecret: function (): string {
        return 'secret';
      },
    },
  };
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let controller: ItemController;
let commonProvider: CommonProvider;
let itemService: ItemService;
async function addItem(name: string, description: string) {
  const item = new ItemEntity();
  item.title = name;
  item.description = description;
  item.idExternal = 'idExternal';
  item.cartPersons = [];
  return controller.add([], item);
}

describe('ItemController', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmSQLITETestingModule(),
        TypeOrmModule.forFeature([ItemEntity, PersonEntity, AddressEntity]),
      ],
      providers: [ItemService, AliExpressService, CommonProvider],
      controllers: [ItemController],
    }).compile();
    controller = module.get<ItemController>(ItemController);
    commonProvider = module.get<CommonProvider>(CommonProvider);
    itemService = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should add item', async () => {
    const savedItem = await addItem('name', 'description');
    expect(savedItem.id).toBeDefined();
    expect(savedItem.createDateTime).toBeDefined();
    expect(savedItem.createDateTime).toEqual(savedItem.lastChangedDateTime);
    expect(savedItem.title).toEqual('name');
    expect(savedItem.description).toEqual('description');
  });
  it('should list items', async () => {
    let currentItem: ItemEntity;
    for (let i = 0; i < 10; i++) {
      currentItem = await addItem('name' + i, 'description' + i);
    }
    // update an existing item with 1 second late to get a different updated_at date
    await sleep(1000);
    currentItem.description = 'updated_description9';
    await controller.add([], currentItem);

    const items = await controller.getAll();
    expect(items.length).toEqual(10);

    const updatedItem = items.find((value) => value.title == 'name9');
    expect(updatedItem.id).toBeDefined();
    expect(updatedItem.createDateTime).toBeDefined();
    expect(
      updatedItem.createDateTime < updatedItem.lastChangedDateTime,
    ).toEqual(true);
    expect(updatedItem.title).toEqual('name9');
    expect(updatedItem.description).toEqual('updated_description9');
  });
  it('parse url item', async () => {
    const content = await fs.readFile('./test/alliexpress_content.html', {
      encoding: 'utf8',
    });
    jest
      .spyOn(commonProvider, 'loadAsyncHtml')
      .mockImplementation(() => Promise.resolve(content));
    const itemDescription = await fs.readFile('./test/alliexpress_item.jpg');
    jest
      .spyOn(commonProvider, 'loadBinaryFile')
      .mockImplementation(() => Promise.resolve(itemDescription));
    const generatedItem = await controller.addFromProvider(
      new UrlBody('https://www.aliexpress.com/item/1005007188346417.html'),
    );
    expect(generatedItem.idExternal).toEqual('1005007188346417');
    expect(generatedItem.title).toEqual(
      'Portable SSD 1TB/2TB External Hard Drive 256TB Large Capacity Hard Disk USB 3.1 High-speed Solid-state Drive for Laptops/PC/MAC',
    );
    expect(generatedItem.description).toContain('Color: Red/Black/Blue/Silver');
    const images = await itemService.getImageFiles(generatedItem.id);
    expect(images.length).toEqual(6);
  });
});
