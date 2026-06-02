import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true});

const bodyValidator = Joi.object({
    name: Joi.string().required().min(3).max(256),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
})

export const addUserValidator = validator.body(bodyValidator);

//.pattern(/^(?=(.*[A-Z]))(?=(.*[!@#$%^&*]))(?=(.*\d))[A-Za-z\d!@#$%^&*]{8,}$/) //8 caratteri|1 speciale|1 lett maiusc|1 num