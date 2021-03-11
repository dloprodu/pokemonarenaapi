'use strict';

const mongoose = require('mongoose');
const {calculatePeriodDates} = require('../lib/dateInterval');

const RankingItemSchema = mongoose.Schema({
  type: { type: String, default: 'ranking' },
  score: {
    type: mongoose.Schema.Types.Number,
    required: [true, 'score required'],
    index: true
  },
  pokemon: { 
    type: mongoose.Schema.Types.String, 
    required: [true, 'pokemon required'], 
    maxLength: [1024, 'pokemon name is too long'] 
  },
  scoredBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
    //required: true,
    index: true
  },
}, { collection: 'ranking', timestamps: true });


/**
 * Returns class list.
 *  - scoredBy: Example: 5bfd92e8ec9a1509496809455 (id_sport)
 *  - date: 
 * @param page
 * @param per_page
 */
 RankingItemSchema.statics.list = async function (filters, page, per_page, sort) {
  let period;

  for (let key in filters) {
    if (!filters[key]) {
      delete filters[key];
      continue;
    }

    switch (key) {
      case 'date':
        period = await calculatePeriodDates(filters.date)
        break;
    }
  }

  delete filters.date;
  
  const queryCount = RankingItem.find(filters);
  if (period && period.length) {
    queryCount.where({date: {$gt: period[0], $lt: period[1]}});
  }
  const count = await RankingItem.find(filters).count();

  const query = RankingItem.find(filters);

  query.skip(page);
  if (period && period.length) {
    query.where({date: {$gt: period[0], $lt: period[1]}});
  }

  query.populate({path: 'scoredBy', select: ['_id', 'alias']})
  query.limit(per_page);

  if (sort) {
    query.sort(sort);
  }

  return { total: count, rows: await query.exec() };
}


const RankingItem = mongoose.model('RankingItem', RankingItemSchema);
module.exports = RankingItem;