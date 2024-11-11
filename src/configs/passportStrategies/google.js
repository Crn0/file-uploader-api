import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userService from '../../services/user.service.js';
import authService from '../../services/auth.service.js';

const options = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile'],
    state: false,
};

const verifyCb = async (accessToken, refreshToken, profile, done) => {
    try {
        const { provider } = profile;
        // eslint-disable-next-line no-unsafe-optional-chaining, no-underscore-dangle
        const { sub: tokenId, given_name: givenName } = profile._json;

        const openIdExist = await userService.meByOpenId(provider, tokenId);

        if (!openIdExist) {
            const username = `${givenName}-${uuidv4()}`;
            const createUser = await authService.signupOpenId({
                provider,
                tokenId,
                username,
            });

            return done(null, createUser.user);
        }

        return done(null, openIdExist.user);
    } catch (error) {
        return done(error);
    }
};

export default new GoogleStrategy(options, verifyCb);
