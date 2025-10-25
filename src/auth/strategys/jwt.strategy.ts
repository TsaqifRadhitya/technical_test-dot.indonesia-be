import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_CONFIG } from '../../config/jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (await this.authService.isValid_jwt(token as string)) {
      return { userId: payload.sub, email: payload.email };
    }
    throw new UnauthorizedException();
  }
}
