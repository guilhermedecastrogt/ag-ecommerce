import { ProductEntity } from '../../domain/entities/product';

export interface ProductsEventsPublisher {
  publishProductCreated(product: ProductEntity): Promise<void>;
  publishProductUpdated(product: ProductEntity): Promise<void>;
  publishStockUpdated(product: ProductEntity): Promise<void>;
}
