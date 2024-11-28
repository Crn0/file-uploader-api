import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import passport from 'passport';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import authService from '../../services/auth.service.js';
import userService from '../../services/user.service.js';
import folderService from '../../services/folder.service.js';
import StorageFactory from '../../storages/index.js';
import FieldError from '../../errors/field.error.js';
import AuthError from '../../errors/auth.error.js';
import APIError from '../../errors/api.error.js';

const { NODE_ENV } = process.env;

const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000, // one day
    httpOnly: true,
    secure: NODE_ENV === 'prod',
    sameSite: NODE_ENV === 'prod' ? 'none' : 'lax',
};

const createUserLocal = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorFields = errors.array().map((err) => {
            const { type, msg: message, path: field } = err;

            return {
                type,
                field,
                message,
            };
        });

        throw new FieldError('Validation Failed', errorFields);
    }

    const user = await authService.signupLocal(req.body);
    const storage = StorageFactory().createStorage('cloudinary');

    // create users' root folder on account creation
    const rootFolder = await storage.createFolder(
        `${process.env.CLOUDINARY_ROOT_FOLDER}/${user.username}-folder`
    );

    await folderService.createFolder(user.id, rootFolder.name, rootFolder.path);

    req.user = user;

    next();
});

const authenticateLocal = [
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorFields = errors.array().map((err) => {
                const { type, msg: message, path: field } = err;

                return {
                    type,
                    field,
                    message,
                };
            });

            throw new FieldError('Validation Failed', errorFields);
        }

        next();
    }),

    (req, res, next) =>
        passport.authenticate(
            'local',
            { session: false },
            (err, user, info) => {
                if (err) return next(new AuthError(err, 422));
                if (!user || info)
                    return next(new AuthError(info.message, 422));

                req.user = user;

                return next();
            }
        )(req, res, next),
];

const authenticateGoogle = passport.authenticate('google', { session: false });

const googleCb = (req, res, next) =>
    passport.authenticate('google', { session: false }, (err, user, _) => {
        if (err) return next(err);

        if (!user) return res.redirect('/api/v1/auth/google');

        req.user = user;

        return next();
    })(req, res, next);

const redirectAuth = asyncHandler(async (req, res, _) => {
    const { user } = req;

    const cleanedUser = authService.clean(user, ['password']);

    const { refreshToken } = authService.login(cleanedUser);

    res.cookie('refresh_token', refreshToken, cookieOptions);

    let redirectURL = process.env.FRONTEND_URL;

    if (!redirectURL.endsWith('/')) {
        redirectURL += '/';
    }

    res.redirect(redirectURL);
});

const refresh = asyncHandler(async (req, res, next) => {
    const { cookies } = req;
    const oldRefreshToken = cookies.refresh_token;

    const decodedToken = jwt.decode(oldRefreshToken);

    const refreshTokenExist = await authService.checkValidToken(
        decodedToken.jti
    );

    res.clearCookie('refresh_token');

    if (refreshTokenExist)
        throw new AuthError(
            'Reused token detected; please log in to reauthenticate',
            401
        );

    const user = await userService.meById(Number(decodedToken.sub));

    if (!user)
        throw new APIError(
            'User not found. The account associated with this refresh token has been deleted',
            404
        );

    // BLACKLIST THE INCOMING REFRESH TOKEN
    await authService.blackListToken(
        decodedToken.sub,
        decodedToken.jti,
        new Date(decodedToken.exp * 1000)
    );

    req.user = user;

    // call the next cb to the login middleware
    return next();
});

const login = asyncHandler(async (req, res, _) => {
    const { cookies } = req;
    const oldToken = cookies.refresh_token;

    res.clearCookie('refresh_token');
    if (oldToken) {
        const decodeToken = jwt.decode(oldToken);
        const expiresIn = new Date(decodeToken.exp * 1000);

        const tokenExist = await authService.checkValidToken(decodeToken.jti);
        const userExist = await userService.meById(Number(decodeToken.sub));

        if (userExist && !tokenExist) {
            await authService.blackListToken(
                decodeToken.sub,
                decodeToken.jti,
                expiresIn
            );
        }
    }

    const { user } = req;

    const cleanedUser = authService.clean(user, ['password']);

    const { accessToken, refreshToken } = authService.login(cleanedUser);

    res.cookie('refresh_token', refreshToken, cookieOptions);

    res.json({
        accessToken,
    });
});

const logout = asyncHandler(async (req, res, _) => {
    const { cookies } = req;
    const refreshToken = cookies.refresh_token;

    if (refreshToken) {
        const decodedToken = jwt.decode(refreshToken);

        const refreshTokenExist = await authService.checkValidToken(
            decodedToken.jti
        );

        if (refreshTokenExist) {
            console.log('refresh token is already blacklisted');
            return res.sendStatus(204);
        }

        const blackListToken = await authService.blackListToken(
            decodedToken.sub,
            decodedToken.jti,
            new Date(decodedToken.exp * 1000)
        );

        console.log(
            `refreshToken with id ${blackListToken.jtwId} is blacklisted`
        );

        res.clearCookie('refresh_token');

        return res.sendStatus(204);
    }

    return res.sendStatus(204);
});

const authFailure = async (req, res) =>
    res.status(500).json({ message: 'something went wrong' });

export default {
    createUserLocal,
    authenticateLocal,
    authenticateGoogle,
    googleCb,
    refresh,
    login,
    redirectAuth,
    logout,
    authFailure,
};
