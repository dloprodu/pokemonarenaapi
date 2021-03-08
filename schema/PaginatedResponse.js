'use strict';

const DataResponse = require('./DataResponse');

/**
 * Paginated response class.
 */
class PaginatedResponse extends DataResponse {
  constructor(rows, total) { 
    super(rows);

    this.total = total;
  }
}

module.exports = PaginatedResponse;