import Joi from 'joi';
import expressJoi from 'express-joi-validation';
import { isObjectIdOrHexString } from 'mongoose';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true});

const confirmRegistration = Joi.object({
    id: Joi.string().required(),
    token: Joi.string().min(16).max(16).required()
})

export const confirmRegistrationValidator = validator.params(confirmRegistration);