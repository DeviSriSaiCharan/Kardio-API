import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/users.entity';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const port = Number.parseInt(
          configService.getOrThrow<string>('DB_PORT'),
          10,
        );
        if (!Number.isFinite(port))
          throw new Error('DB_PORT must be a valid number');
        return {
          type: 'postgres',
          host: configService.getOrThrow<string>('DB_HOST'),
          port,
          username: configService.getOrThrow<string>('DB_USERNAME'),
          password: configService.getOrThrow<string>('DB_PASSWORD'),
          database: configService.getOrThrow<string>('DB_NAME'),
          entities: [User],
        };
      },
    }),

    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
