'use strict'

const moment = require('moment');

module.exports.calculatePeriodDates = async function(period) {
  let minDate = moment(new Date());
  let maxDate = moment(new Date());

  switch (period) {
    case 'today':
      minDate.subtract(1, 'days');
      break
    case 'week':
      minDate.subtract(7, 'days');
      break
    case 'month':
      minDate.subtract(1, 'months');
      break
    default:
      break;
  }

  return [minDate.format(), maxDate.format()]
}