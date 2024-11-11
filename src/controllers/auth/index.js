import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import passport from 'passport';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import authService from '../../services/auth.service.js';
import userService from '../../services/user.service.js';
import FormError from '../../errors/form.error.js';
import AuthError from '../../errors/auth.error.js';

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

        throw new FormError('Validation Failed', errorFields);
    }

    const user = await authService.signupLocal(req.body);

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

            throw new FormError('Validation Failed', errorFields);
        }

        next();
    }),

    (req, res, next) =>
        passport.authenticate(
            'local',
            { session: false },
            (err, user, info) => {
                if (err) return next(new AuthError(err, 401));
                if (!user || info)
                    return next(new AuthError('Authentication Failed', 401));

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

    // BLACKLIST THE INCOMING REFRESH TOKEN
    await authService.blackListToken(
        decodedToken.sub,
        decodedToken.jti,
        new Date(decodedToken.exp * 1000)
    );

    const user = await userService.meById(Number(decodedToken.sub));

    req.user = user;

    // call the next cb to the login middleware
    return next();
});

const login = asyncHandler(async (req, res, _) => {
    const { cookies } = req;
    const oldToken = cookies.refresh_token;

    if (oldToken) {
        res.clearCookie('refresh_token');

        const decodeToken = jwt.decode(oldToken);
        const expiresIn = new Date(decodeToken.exp);

        const tokenExist = await authService.checkValidToken(decodeToken.jti);

        if (!tokenExist) {
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
        user: cleanedUser,
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

        res.clearCookie('refresh_token', cookieOptions);

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
    logout,
    authFailure,
};