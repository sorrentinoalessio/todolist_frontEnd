import Joi from 'joi';
import expressJoi from 'express-joi-validation';

const createValidator = expressJoi.createValidator;
const validator = createValidator({ passError: true});

const idParamValidator = Joi.object({
    id: Joi.string().hex().length(24).required()
})

export const activityIdParamValidator = validator.params(idParamValidator);

