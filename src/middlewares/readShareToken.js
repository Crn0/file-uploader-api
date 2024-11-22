import 'dotenv/config';
import jwt from 'jsonwebtoken';
import APIError from '../errors/api.error.js';

const readShareToken = (req, res, next) => {
    let secret;

    const { token } = req.params;
    const { type } = req.query;

    if (type === 'folder') {
        secret = process.env.FOLDER_SHARE_URL_SECRET;
    }
    if (type === 'file') {
        secret = process.env.FILE_SHARE_URL_SECRET;
    }

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
