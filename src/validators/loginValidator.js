import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true});

const loginBodyValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const loginValidator = validator.body(loginBodyValidator);