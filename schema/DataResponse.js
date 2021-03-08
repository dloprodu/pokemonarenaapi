'use strict';

const BaseResponse = require('./BaseResponse');

/**
 * Data response class.
 */
class DataResponse extends BaseResponse {
  constructor(data) {
    super();

    this.data = data;
  }
}

module.exports = DataResponse;