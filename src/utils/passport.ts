import { SECRET_KEY } from '@config';
import passport from 'passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};

passport.use(
  new Strategy(opts, (token, done) => {
    const { _id } = token;
    if (_id) {
      return done(null, _id);
    } else {
      return done(null, false);
    }
  }),
);

export default passport;
