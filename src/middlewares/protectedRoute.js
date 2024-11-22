import AuthError from '../errors/auth.error.js';

const protectedRoute = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        next(
            new AuthError('Access denied. Please authenticate to proceed', 401)
        );
    }
};

export default protectedRoute;
