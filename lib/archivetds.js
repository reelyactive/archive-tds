/**
 * Copyright reelyActive 2024
 * We believe in an open Internet of Things
 */

const Tedious = require('tedious');
const url = require('url');

const DEFAULT_CONFIG = {
  printErrors: true,
  server: '127.0.0.1',
  authentication: {
    type: 'default',
    options: {userName: 'admin', password: 'admin'},
  },
  options: {
    encrypt: false,
    database: 'reelyactive',
  },
};

class ArchiveTDS {
  /**
   * ArchiveTDS constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    let self = this;
    self.options = options || {};

    // connect to the database
    this.connection = new Tedious.Connection(options.config || DEFAULT_CONFIG);
    handleConnectionEvents(self);
    this.connection.connect();

    if (options.app) {
      configureExpress(options.app, self);
    }

    if (options.printErrors) {
      console.log('archive-tds: ArchiveTDS instance is ready');
    }
  }
}

/**
 * Handle events from the SQL Server connection.
 * @param {ArchiveTDS} instance The ArchiveTDS instance.
 */
function handleConnectionEvents(instance) {
  instance.connection.on('connect', err => {
    if (err && instance.options.printErrors) {
      console.log('archive-tds: Database connection failed with', err);
    } else {
      instance.options.app.set('databaseConnection', instance.connection);
      if (instance.options.printErrors) {
        console.log('archive-tds: Database connection successful.');
      }
    }
  });
}

/**
 * Configure the routes of the API.
 * @param {Express} app The Express app.
 * @param {ArchiveTDS} instance The ArchiveTDS instance.
 */

function configureExpress(app, instance) {
  app.use(function (req, res, next) {
    req.archivetds = instance;
    next();
  });
  app.use(authenticationMiddleware);
  app.use('/archive/dynamb', require('./routes/dynamb'));
}

/**
 * Middleware to authenticate the request.
 * TODO: implement a more secure authentication mechanism.
 * TODO: move this to a separate module.
 * @param {Object} req The HTTP request.
 * @param {Object} res The HTTP result.
 * @param {Function} next The next function.
 */
authenticationMiddleware = function (req, res, next) {
  console.log('archive-tds: Authenticating request');
  if (authenticate(req)) {
    console.log('archive-tds: Authentication successful');
    return next();
  } else {
    console.log('archive-tds: Authentication failed');
    return res.status(401).send('Unauthorized');
  }
};

/**
 * Authenticate the request based on the query string
 * against the ACCESS_TOKEN environment variable.
 * If no ACCESS_TOKEN is defined, all requests are allowed.
 * @param {Object} request The HTTP request.
 * @return {boolean} Whether the request is authenticated.
 */
const authenticate = request => {
  const {token} = url.parse(request.url, true).query;
  if (process.env.ACCESS_TOKEN === undefined) {
    console.warn('======================================================');
    console.warn('WARNING: No ACCESS_TOKEN environment variable defined.');
    console.warn('         Allowing all connections, this is not secure!');
    console.warn('         Define an ACCESS_TOKEN environment variable.');
    console.warn('======================================================');
    return true;
  }
  return token === process.env.ACCESS_TOKEN;
};

module.exports = ArchiveTDS;
