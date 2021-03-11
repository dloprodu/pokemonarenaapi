'use strict';

const express = require('express')
,router = express.Router();

const { check, query, validationResult } = require('express-validator');
const User = require('../../../models/User');


/**
 * GET /
 * Find user.
 * Query params:
 *  - alias: Example: 5bfd92e8ec9a1509496809455 (id_sport)
**/
router.get('/:alias', async (req, res, next) => {
  try {
    validationResult(req).throw();

    const filter = {};
    if (req.params && req.params.alias) {
      filter.alias = req.params.alias.trim().toLowerCase();
    }

    const user = await User.findOne(filter).exec();
    
    res.apiDataResponse( user );
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /
 * Create a new user by its alias.
 * Query params:
 *  - alias
 **/
 router.post('/create', [
  check('alias').isString().withMessage('alias not valid'),
], async (req, res, next) => {
  try {
    const data = {};

    if (req.body && req.body.alias) {
      data.alias = req.body.alias.trim().toLowerCase();
    }

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