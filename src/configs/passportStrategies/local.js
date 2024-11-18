import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import userRepository from '../../repository/user.repository.js';

const options = { usernameField: 'email', passwordField: 'password' };

const verifyCb = async (email, password, done) => {
    try {
        const user = await userRepository.getUserByEmail(email);

        if (!user)
            return done(null, false, { message: 'Invalid email or password' });

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            return done(null, false, { message: 'Invalid email or password' });

        return done(null, user);
    } catch (error) {
        return done(error);
    }
};

export default new LocalStrategy(options, verifyCb);
