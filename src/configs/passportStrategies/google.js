import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import authService from '../../services/auth.service.js';
import userService from '../../services/user.service.js';
import folderService from '../../services/folder.service.js';
import StorageFactory from '../../storages/index.js';

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

        let user = await userService.meByOpenId(provider, tokenId);

        if (!user) {
            const storage = StorageFactory().createStorage('cloudinary');
            const username = `${givenName}-${uuidv4()}`;
            await authService.signupOpenId(
                {
                    provider,
                    tokenId,
                    username,
                },
                { user: true }
            );

            // create users' root folder on account creation
            const rootFolder = await storage.createFolder(
                `${process.env.CLOUDINARY_ROOT_FOLDER}/${username}`
            );

            user = await userService.meByOpenId(provider, tokenId);

            await folderService.createFolder(
                user.id,
                rootFolder.name,
                rootFolder.path
            );
        }

        user.fileSize = Number(user.fileSize);

        return done(null, user);
    } catch (error) {
        return done(error);
    }
};

export default new GoogleStrategy(options, verifyCb);
