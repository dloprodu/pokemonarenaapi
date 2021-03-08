'use strict';

const express = require('express')
,router = express.Router();

const { check, query, validationResult } = require('express-validator');
const RankingItem = require('../../../models/RankingItem');


/**
 * GET /
 * Find ranking.
 * Query params:
 *  - alias: Example: 5bfd92e8ec9a1509496809455 (id_sport)
 *  - date: Example: today | week | month
 *  - sort: Example: '-date', '+score'
**/
router.get('/find', [
  query('alias').optional().isString().withMessage('alias not valid'),
  query('date').optional().isString().withMessage('date not valid'),
  query('sort').optional().isString().withMessage('sort not valid'),
  query('page').isInt({ min: 0 }).withMessage('page must be a number'),
  query('per_page').optional().isInt({ min: 1 }).withMessage('per_page must be a number')
], async (req, res, next) => {
  try {
    validationResult(req).throw();

    const filter = {
      alias: req.query.alias,
      date: req.query.date,
    };

    const page = parseInt( req.query.page ) || 0;
    const per_page = parseInt( req.query.per_page ) || 10;

    const result = await RankingItem.list(filter, page, per_page, req.query.sort);

    res.apiPaginatedResponse( result.rows, result.total );
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /
 * Save a ranking item.
 * Query params:
 *  - scoredBy. Example: 5bfd92e8ec9a1509496809455 (id_class).
 *  - score. Required
 *  - pokemon: Required
 *  - opponent: Example: 5bfd92e8ec9a1509496809455 (id_class)
 *  - opponentPokemon: Required
 **/
 router.post('/add', [
  check('scoredBy').isString().withMessage('scored by not valid'),
  check('score').isNumeric({min: 0, max: 10000}).withMessage('score not valid'),
  check('pokemon').isString().withMessage('pokemon not valid'),
  check('opponent').isString().withMessage('opponent not valid'),
  check('opponentPokemon').isString().withMessage('opponent pokemon not valid'),
], async (req, res, next) => {
  try {
    const data = req.body;

    const newClass = new RankingItem(data);
    newClass.save((err, dataRanking ) => {
      if (err) {
        next(err);
        return;
      }
      
      res.apiDataResponse(dataRanking);
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;