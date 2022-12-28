import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie; // refreshToken=werwerwerw
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },

      secretOrKey: process.env.JWT_REFRESH_KEY,
    });
  }

  validate(payload) {
    console.log(payload); // { email: q@q.com, sub: askljdfklj-128930djk }
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
