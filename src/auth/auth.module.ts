import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategys/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONFIG } from '../config/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategys/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_CONFIG.secret,
      signOptions: {
        expiresIn: '30d',
      },
    }),
    TypeOrmModule.forFeature([Session]),
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
