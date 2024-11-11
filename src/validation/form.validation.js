import { body } from 'express-validator';
import userRepository from '../repository/user.repository.js';
import client from '../db/client.js';

const username = () =>
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username name must not be empty')
        .custom(async (val) => {
            const regex = /^[a-zA-Z0-9_]+$/;
            // https://regexr.com/86mur

            return regex.test(val);
        })
        .withMessage(
            'Username must not contain special characters except underscore'
        )
        .custom(async (val) => {
            const userExist = await userRepository.getUserByUsername(val);

            if (userExist) {
                await client.user.delete({ where: { username: val } });
                return Promise.resolve();
            }
            // return Promise.reject(new Error('username already in use'));

            return Promise.resolve();
        })
        .escape();

const email = (isSignUp) => {
    if (isSignUp)
        return body('email')
            .trim()
            .normalizeEmail({
                all_lowercase: true,
                gmail_lowercase: true,
            })
            .notEmpty()
            .withMessage('Email name must not be empty')
            .custom(async (val) => {
                const userExist = await userRepository.getUserByEmail(val);

                if (userExist)
                    return Promise.reject(new Error('Email already in use'));

                return Promise.resolve();
            });

    return body('email')
        .trim()
        .normalizeEmail({
            all_lowercase: true,
            gmail_lowercase: true,
        })
        .notEmpty()
        .withMessage('Email name must not be empty');
};

const password = () =>
    body('password')
        .trim()
        .isStrongPassword({
            minLength: 8,
            minUppercase: 0,
            minLowercase: 0,
            minNumbers: 0,
            minSymbols: 0,
        })
        .withMessage(
            'Password must contain at least one uppercase letter and be a minimum of 8 characters'
        );

const confirmPassword = () =>
    body('confirm-password')
        .custom((val, { req }) => val === req.body.password)
        .withMessage('Password does not match');

export default {
    signUp: [username(), email(true), password(), confirmPassword()],
    login: [email(false), password()],
};
