import 'dotenv/config';
import jwt from 'jsonwebtoken';
import AuthError from '../errors/auth.error.js';

const readAcessToken = (req, res, next) => {
    const bearerHeader = req.headers.authorization;

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                console.log('expired access token');

                next(
                    new AuthError('Expired token. Please reauthenticate', 403)
                );
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        next();
    }
};

export default readAcessToken;
