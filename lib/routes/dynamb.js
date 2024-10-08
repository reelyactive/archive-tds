/**
 * Copyright reelyActive 2015-2021
 * We believe in an open Internet of Things
 */

const express = require('express');
const Tedious = require('tedious');

let router = express.Router();

router.route('/').get(function (request, response) {
  retrieveDynamb(request, response);
});

/**
 * Retrieve the dynambs from the archive store.
 * @param {Object} req The HTTP request.
 * @param {Object} res The HTTP result.
 *
 * returns {Object} The response object with the database rows.
 */
function retrieveDynamb(req, res) {
  let queryOptions = {
    firstId: req.query.firstId || null, // the first id from the database to retrieve
    lastId: req.query.lastId, // the last id from the database to retrieve
    maxRows: req.query.maxRows, // the maximum number of rows to retrieve
  };

  switch (req.accepts(['json'])) {
    default:
      const dynambData = retrieveDyanmbFromStore(
        req.app.get('databaseConnection'),
        queryOptions,
        (err, data) => {
          if (err) {
            console.log('Error retrieving dynamb data', err);
            res.status(500).send('Error retrieving dynamb data.');
          }
          res.json(data);
        }
      );
      break;
  }
}

/**
 * Execute a query to retrieve dynamb data from the archive store.
 * @param {*} databaseConnection - The connection to the database, setup in the app.
 * @param {*} queryOptions - The options for the SQL query: firstId, lastId, maxRows.
 * @param {*} callback - The callback function to execute when the query is complete.
 */
function retrieveDyanmbFromStore(databaseConnection, queryOptions, callback) {
  let results = [];

  // build the SQL query based on the query options
  let query = 'SELECT * FROM dynamb';

  if (queryOptions.firstId) {
    query += ` WHERE _storeId >= ${queryOptions.firstId}`;
  }

  if (queryOptions.lastId && queryOptions.firstId) {
    // a `last id` query is only valid along with a `first id` query
    query += ` AND _storeId <= ${queryOptions.lastId}`;
  }

  if (queryOptions.maxRows) {
    query += ` ORDER BY _storeId OFFSET 0 ROWS FETCH NEXT ${queryOptions.maxRows} ROWS ONLY`;
  }

  const request = new Tedious.Request(query, (err, rowCount) => {
    if (err) {
      console.log('archive-tds: Error executing SQL query', err);
    }
  });

  request.on('row', columns => {
    let row = {};
    columns.forEach(column => {
      row[column.metadata.colName] = column.value;
    });
    results.push(row);
  });
  request.on('doneProc', () => {
    console.log('archive-tds: Query request complete');
    if (callback && typeof callback === 'function') {
      callback(null, results);
    }
  });

  databaseConnection.execSql(request);
}

module.exports = router;
