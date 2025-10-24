import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MutationModule } from './mutation/mutation.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MutationModule, UserModule, TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any || "sqlite",
      host: process.env.DB_HOST || "localhost",
      username: process.env.DB_USER || "postgres",
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      database: process.env.DB_NAME || "nestjs",
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === "production" ? false : true
    }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
