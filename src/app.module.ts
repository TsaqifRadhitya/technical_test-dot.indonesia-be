import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MutationModule } from './mutation/mutation.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from './config/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MutationModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: DatabaseConfig.type,
      host: DatabaseConfig.host,
      username: DatabaseConfig.username,
      port: DatabaseConfig.port,
      database: DatabaseConfig.database,
      autoLoadEntities: true,
      synchronize: DatabaseConfig.synchronize,
      password: DatabaseConfig.password,
      keepAlive: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
