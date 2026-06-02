import BadRequestException from "../../exceptions/BadRequestException.js";
import Joi from "joi";

class BaseValidator {
    constructor(schema) {
        this.schema = schema;
    }
    validate(data) {
        const res = this.schema.validate(data);

        if(res.error){
            const [ message, code ] = res.error.details[0].message.split(':');
             throw new BadRequestException(message, parseInt(code));
     
        }
             
    }

}
export default (schema) => {
    return new BaseValidator(schema);
}