import { Injectable } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ItemEntity } from '../../model/item.entity';
import { HTMLElement, parse } from 'node-html-parser';
import { CommonProvider } from './common.provider';

@Injectable()
export class AliExpressService implements ProviderService {
  constructor(private commonProvider: CommonProvider) {}
  getHostname(): string {
    return 'www.aliexpress.com';
  }

  public async generateItem(url: string): Promise<ItemEntity> {
    const html = await this.commonProvider.loadAsyncHtml(url);
    const root: HTMLElement = parse(html);
    const item = new ItemEntity();
    item.idExternal = url.slice(url.search('item/') + 5, url.search('.html'));
    item.title = root.querySelector('h1[data-pl="product-title"]').text;
    item.description = root.querySelector('.detailmodule_html').innerText;
    item.images = await this.downloadImages(root);
    return item;
  }

  public async downloadImages(root: HTMLElement) {
    const scripts = root.getElementsByTagName('script');
    let script = scripts.filter(
      (script) =>
        script.childNodes[0] &&
        script.childNodes[0].textContent.includes('window._d_c_.DCData'),
    )[0].textContent;
    script = script.replace(/(\r\n|\n|\r)/gm, '');
    const dataRegExp = / window._d_c_.DCData = {.*\s*};/;
    const data = dataRegExp.exec(script);
    let dataStrip = data[0].replace(/\s*window._d_c_.DCData\s*=\s*/, '');
    dataStrip = dataStrip.substring(0, dataStrip.length - 1);
    const json = JSON.parse(dataStrip.trim());
    const images = [];
    for (const image of json['imagePathList'] as string[]) {
      images.push(await this.commonProvider.loadBinaryFile(image));
    }
    return images;
  }
}
