'use strict';

/**
 * Base response class.
 */
class BaseResponse {
  constructor() {
    this.version = '1.0.0';
    this.status = 'success';
    this.message = 'OK';
    this.datetime = new Date().toISOString();
  }
}

module.exports = BaseResponse;