'use strict';

const mongoose = require('mongoose');
const {calculatePeriodDates} = require('../lib/dateInterval');

const RankingItemSchema = mongoose.Schema({
  type: { type: String, default: 'ranking' },
  score: {
    type: Number,
    required: [true, 'score required'],
  },
  pokemon: { 
    type: String, 
    required: [true, 'pokemon required'], 
    maxLength: [1024, 'pokemon name is too long'] 
  },
  opponent: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  opponentPokemon: { 
    type: String, 
    required: [true, 'opponent\'s pokemon required'], 
    maxLength: [1024, 'pokemon name length is too long'] 
  },
  scoredBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    //required: true,
    index: true
  },
}, { collection: 'ranking', timestamps: true });


/**
 * Returns class list.
 *  - alias: 'alex'
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

  const count = await RankingItem.find(filters).count();
  const query = RankingItem.find(filters);

  query.skip(page);
  if (period && period.length) {
    query.where({date: {$gt: period[0], $lt: period[1]}});
  }
  query.populate({path: 'scoredBy', select: ['_id', 'alias']})
  query.populate({path: 'opponent', select: ['_id', 'alias']})
  query.limit(per_page);

  if (sort) {
    query.sort(sort);
  }
  // query.select(fields);

  return { total: count, rows: await query.exec() };
}


const RankingItem = mongoose.model('RankingItem', RankingItemSchema);
module.exports = RankingItem;