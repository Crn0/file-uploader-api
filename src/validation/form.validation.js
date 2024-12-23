import { body } from 'express-validator';
import userRepository from '../repository/user.repository.js';

const username = () =>
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username cannot be empty')
        .custom(async (val) => {
            const regex = /^[a-zA-Z0-9_]+$/;
            // https://regexr.com/86mur

            return regex.test(val);
        })
        .withMessage(
            'Username can only contain letters, numbers, and underscores'
        )
        .custom(async (val) => {
            const userExist = await userRepository.getUserByUsername(val);

            if (userExist)
                return Promise.reject(new Error('username already in use'));

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
            .withMessage('Email cannot be empty')
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
        .withMessage('Email cannot be empty');
};

const password = () =>
    body('password')
        .trim()
        .isStrongPassword({
            minLength: 8,
            minUppercase: 1,
            minLowercase: 0,
            minNumbers: 1,
            minSymbols: 0,
        })
        .withMessage(
            'Password must contain at least one uppercase letter, one number and be a minimum of 8 characters'
        );

const confirmPassword = () =>
    body('confirm_password')
        .custom((val, { req }) => val === req.body.password)
        .withMessage('Password does not match');

const resourceName = () =>
    body('name').trim().notEmpty().withMessage('Name cannot be empty');

export default {
    signUp: [username(), email(true), password(), confirmPassword()],
    login: [email(false), password()],
    resourceEntity: resourceName(),
};
