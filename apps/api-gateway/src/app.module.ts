import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [HealthModule, UsersModule, OrdersModule, AuthModule, ProductsModule],
})
export class AppModule {}
