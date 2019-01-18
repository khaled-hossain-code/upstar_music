const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  const count = Artist.estimatedDocumentCount();
  const all = Artist
    .find(buildQuery(criteria))
    .sort(`${sortProperty}`)
    .skip(offset)
    .limit(limit);

  return Promise.all([all, count]).then((results) => {
    return {
      all: results[0],
      count: results[1],
      offset,
      limit
    };
  });
};

const buildQuery = (criteria) {
  let query = {};

  const {
    age,
    name,
    yearsActive
  } = criteria;

  if (age) {
    query.age = {
      $gte: age.min,
      $lte: age.max
    };
  }

  if (yearsActive) {
    query.yearsActive = {
      $gte: yearsActive.min,
      $lte: yearsActive.max
    };
  }

  return query;
}