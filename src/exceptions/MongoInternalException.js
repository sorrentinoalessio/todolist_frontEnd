import DomainException from './DomainException.js';

export default class MongoInternalException extends DomainException {
  status;
  code;

  constructor(message, code) {
    super(message);
    this.message = message;
    this.status = 500;
    this.code = code;
  }
}

