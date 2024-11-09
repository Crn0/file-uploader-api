import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import queries from '../../db/queries/index.js';

const options = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['email', 'profile'],
    state: true,
};

const verifyCb = async (accessToken, refreshToken, profile, done) => {
    try {
        const { provider, tokenId, givenName } = profile;

        const userExist = await queries.get.userByOpenId(tokenId);

        if (!userExist) {
            const username = `${givenName}-${uuidv4()}`;
            const createUser = await queries.post.userOpenId(
                provider,
                tokenId,
                username
            );

            return done(null, createUser);
        }

        return done(null, userExist);
    } catch (error) {
        return done(error);
    }
};

export default new GoogleStrategy(options, verifyCb);
