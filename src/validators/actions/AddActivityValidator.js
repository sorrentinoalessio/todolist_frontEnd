import Joi from "joi";
import baseValidator from "./BaseValidator.js";

class AddActivityValidator {
    constructor() {
        this._schema = Joi.object({
            name: Joi.string().required().min(3).max(256),
            description: Joi.string().required().min(3),
            status: Joi.string().valid('open', 'closed'),
            dueDate: Joi.date()
        })
        this.validator = baseValidator(this._schema);
    }

    validate(data) {

        this.validator.validate(data);
        return data;

    }
}

export default new AddActivityValidator();
