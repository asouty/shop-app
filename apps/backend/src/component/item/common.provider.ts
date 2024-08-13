import { Injectable } from '@nestjs/common';
import { Builder, Browser } from 'selenium-webdriver';

@Injectable()
export class CommonProvider {
  public async loadHtml(url: string) {
    try {
      const text = await fetch(url);
      return await text.text();
    } catch (e) {
      console.log(e);
    }
  }
  public async loadAsyncHtml(url: string) {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get(url);
    await driver.executeScript('window.scrollBy(0,3000)', '');
    const result = await driver.getPageSource();
    await driver.close();
    return result;
  }

  public async loadBinaryFile(url: string) {
    const browser = await fetch(url);
    return Buffer.from(new Uint8Array(await browser.arrayBuffer()));
  }
}
