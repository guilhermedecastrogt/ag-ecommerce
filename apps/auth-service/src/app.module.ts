import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { LoggerModule } from 'nestjs-pino';
import { ClsModule } from 'nestjs-cls';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { ValidateAccessTokenUseCase } from './application/use-cases/validate-access-token.use-case';

import { I_AUTH_USER_REPOSITORY } from './domain/repositories/auth-user.repository.interface';
import { PrismaAuthUserRepository } from './infrastructure/database/prisma-auth-user.repository';

import { I_REFRESH_SESSION_REPOSITORY } from './domain/repositories/refresh-session.repository.interface';
import { PrismaRefreshSessionRepository } from './infrastructure/database/prisma-refresh-session.repository';

import { I_PASSWORD_HASHER } from './application/interfaces/password-hasher.interface';
import { Argon2PasswordHasher } from './infrastructure/crypto/argon2-password-hasher';

import { I_JWT_SERVICE } from './application/interfaces/jwt-service.interface';
import { JwtServiceWrapper } from './infrastructure/jwt/jwt-service-wrapper';

import { I_EVENT_PUBLISHER } from './application/interfaces/event-publisher.interface';
import { KafkaEventPublisher } from './infrastructure/events/kafka-event-publisher';
import { CorrelationInterceptor } from './common/interceptors/correlation.interceptor';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        customProps: () => ({ service: 'auth-service' }),
      },
    }),
    ClsModule.forRoot({ global: true }),
    HealthModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error(
            'JWT_SECRET environment variable is not defined. Refusing to start.',
          );
        }
        return { secret };
      },
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:29092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: CorrelationInterceptor },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    ValidateAccessTokenUseCase,
    {
      provide: I_AUTH_USER_REPOSITORY,
      useClass: PrismaAuthUserRepository,
    },
    {
      provide: I_REFRESH_SESSION_REPOSITORY,
      useClass: PrismaRefreshSessionRepository,
    },
    {
      provide: I_PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },
    {
      provide: I_JWT_SERVICE,
      useClass: JwtServiceWrapper,
    },
    {
      provide: I_EVENT_PUBLISHER,
      useClass: KafkaEventPublisher,
    },
  ],
})
export class AppModule {}
