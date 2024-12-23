import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import authRepository from '../repository/auth.repository.js';
import client from '../db/client.js';

const {
    SALT,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXP,
    REFRESH_TOKEN_EXP,
} = process.env;

const clean = (obj, keysToRemove) => {
    if (!Array.isArray(keysToRemove)) {
        throw new Error(
            `keysToRemove is type of ${typeof keysToRemove}; expected an type of array`
        );
    }

    const objArr = Object.entries(obj).filter(
        ([value, _]) => !keysToRemove.includes(value)
    );

    return Object.fromEntries(objArr);
};

const checkValidToken = async (jwtId) =>
    client.blackListToken.findUnique({ where: { jwtId } });

const generateTokenCurry = (type) => (user, JWTSecret, expiresIn) => {
    if (!['access', 'refresh'].includes(type)) {
        throw new Error(
            `invalid type of ${type}; expected access or refresh as type`
        );
    }

    if (type === 'access') {
        return jwt.sign(
            {
                ...user,
            },
            JWTSecret,
            {
                expiresIn,
                subject: user.username,
            }
        );
    }

    const jwtId = uuidv4();

    const refreshToken = jwt.sign({}, JWTSecret, {
        expiresIn,
        jwtid: jwtId,
        subject: String(user.id),
    });

    return refreshToken;
};

const signupLocal = async (userInputDTO, options) => {
    const salt = bcrypt.genSaltSync(Number(SALT));

    const { username, email, password } = userInputDTO;

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await authRepository.createLocal(
        username,
        email,
        hashedPassword,
        options
    );

    return user;
};

const signupOpenId = async (openIdDTO, options) => {
    try {
        const { provider, tokenId, username } = openIdDTO;

        const user = await authRepository.createOpenId(
            provider,
            tokenId,
            username,
            options
        );

        return user;
    } catch (error) {
        return error;
    }
};

const login = (userInputDTO) => {
    const userDTO = { ...userInputDTO };

    if (userDTO.password) {
        delete userDTO.password;
    }

    const accessTokenCurry = generateTokenCurry('access');
    const refreshTokenCurry = generateTokenCurry('refresh');

    const accessToken = accessTokenCurry(
        userDTO,
        ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_EXP
    );

    const refreshToken = refreshTokenCurry(
        userDTO,
        REFRESH_TOKEN_SECRET,
        REFRESH_TOKEN_EXP
    );

    return { accessToken, refreshToken };
};

const blackListToken = async (userId, jwtId, expiresIn) => {
    const token = authRepository.blackListToken(
        Number(userId),
        jwtId,
        expiresIn
    );

    return token;
};

const deleteExpiredTokens = async () => authRepository.deleteExpiredTokens();

const deleteTokensByUserId = async (userId) =>
    authRepository.deleteTokensByUserId(userId);

export default {
    clean,
    checkValidToken,
    signupLocal,
    signupOpenId,
    login,
    blackListToken,
    deleteExpiredTokens,
    deleteTokensByUserId,
};
