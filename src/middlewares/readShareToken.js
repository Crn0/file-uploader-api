import 'dotenv/config';
import jwt from 'jsonwebtoken';
import APIError from '../errors/api.error.js';

const readShareToken = (req, res, next) => {
    const secret = process.env.SHARE_URL_SECRET;

    const { token } = req.params;

    if (typeof token !== 'undefined') {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.log(err);
                console.log('expired share token');

                next(
                    new APIError(
                        'The link you followed is no longer available. It may have expired or may no longer exist',
                        410
                    )
                );
            } else {
                req.shareToken = decoded;

                next();
            }
        });
    }
};

export default readShareToken;
