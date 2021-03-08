'use strict';

const BaseResponse = require('./BaseResponse');

/**
 * Error response class.
 */
class ErrorResponse extends BaseResponse {
  constructor(err) {
    super();

    this.error = err.message;
    this.status = 'error';
    this.message = err.errorType ? err.errorType : 'Unknown error';
  }
}

module.exports = ErrorResponse;