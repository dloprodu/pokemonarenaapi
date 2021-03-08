'use strict';

const fs = require("fs");

const i18n = JSON.parse( fs.readFileSync(__dirname + "//i18n.json", "utf8") );

/**
 * Translates the token for the language given.
 * @param {string} token 
 * @param {string} lang 
 * @returns {string} returns translation whether the token exists or the token in other case.
 */
function translate( token, lang ) {
  if (!token || !lang) {
    return '';
  }

  let path = token.split('.');
  let value = i18n[lang];
  
  do {
    value = value[path.shift()];
  } while(value && path.length);
  
  return (typeof value === 'string')
    ? value
    : token;
}

module.exports = translate;