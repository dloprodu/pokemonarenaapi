'use strict';

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  type: { type: String, default: 'user' },
  alias: { 
    type: mongoose.Schema.Types.String,
    required: [true, 'alias required'], 
    minLength: [3, 'alias need at least 3 characters'], 
    maxLength: [255, 'alias too long'], 
    trim: true,
    unique: true,
    index: true
  },
}, { collection: 'users', timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;