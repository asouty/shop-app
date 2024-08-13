// item.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './item.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { ItemEntity } from '../../model/item.entity';
import { Public } from '../../auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AliExpressService } from './ali-express.service';
import { ProviderService } from './provider.service';

export class UrlBody {
  constructor(url: string) {
    this.url = url;
  }
  @ApiProperty()
  url: string;
}

@Controller('item')
@ApiBearerAuth()
export class ItemController {
  private providerByHostname: Map<string, ProviderService>;
  constructor(
    private readonly service: ItemService,
    alliExpress: AliExpressService,
  ) {
    this.providerByHostname = new Map<string, ProviderService>();
    this.providerByHostname.set(alliExpress.getHostname(), alliExpress);
  }

  @Get()
  @ApiCreatedResponse({ type: ItemEntity, isArray: true })
  @Public()
  public getAll() {
    return this.service.getAll();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Item', type: ItemEntity })
  @ApiCreatedResponse({ type: ItemEntity })
  public async add(@UploadedFiles() images: any[], @Body() item: ItemEntity) {
    item.images = images;
    return this.service.add(item);
  }

  @Post('provider')
  @ApiCreatedResponse({ type: ItemEntity })
  public async addFromProvider(@Body() url: UrlBody) {
    return this.service.add(
      await this.providerByHostname
        .get(new URL(url.url).hostname)
        .generateItem(url.url),
    );
  }
}
