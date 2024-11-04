import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import queries from '../../db/queries/index.js';

const options = { usernameField: 'email', passwordField: 'password' };

const verifyCb = async (email, password, done) => {
    try {
        const userOptions = {
            username: true,
            email: true,
            role: true,
            password: true,
            createdAt: true,
            updatedAt: true,
        };

        const userExist = await queries.get.userByEmail(email, userOptions);

        if (!userExist)
            return done(null, false, { message: 'Invalid email or password' });

        const match = await bcrypt.compare(password, userExist.password);

        if (!match)
            return done(null, false, { message: 'Invalid email or password' });

        return done(null, userExist);
    } catch (error) {
        return done(error);
    }
};

export default new LocalStrategy(options, verifyCb);
