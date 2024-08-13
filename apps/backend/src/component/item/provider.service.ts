import { ItemEntity } from '../../model/item.entity';
export interface ProviderService {
  getHostname(): string;
  generateItem(url: string): Promise<ItemEntity>;
}
