'use strict';

const express = require('express')
,router = express.Router();

const { check, query, validationResult } = require('express-validator');
const User = require('../../../models/User');


/**
 * GET /
 * Find ranking.
 * Query params:
 *  - alias: Example: 5bfd92e8ec9a1509496809455 (id_sport)
 *  - date: Example: today | week | month
 *  - sort: Example: '-date', '+score'
**/
router.get('/find', [
  query('alias').isString().withMessage('alias not valid'),
], async (req, res, next) => {
  try {
    validationResult(req).throw();

    const user = await User.findOne({ alias: req.query.alias }).exec();
    
    res.apiDataResponse( user );
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /
 * Save a ranking item.
 * Query params:
 *  - alias
 **/
 router.post('/create', [
  check('alias').isString().withMessage('alias not valid'),
], async (req, res, next) => {
  try {
    const data = req.body;

    const newUser = new User(data);
    newUser.save((err, dataUser ) => {
      if (err) {
        next(err);
        return;
      }
      
      res.apiDataResponse(dataUser);
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;