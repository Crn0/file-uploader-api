import jwt from 'jsonwebtoken';
import AuthError from '../errors/auth.error.js';

const readRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        console.log('There is no refresh token');
        return next(
            new AuthError(
                '401 Unauthorized: You must log in to access this resource',
                401
            )
        );
    }

    return jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, _) => {
            if (err) {
                console.log(err);
                console.log('expired refresh token');
                return res.sendStatus(401);
            }

            return next();
        }
    );
};

export default readRefreshToken;
