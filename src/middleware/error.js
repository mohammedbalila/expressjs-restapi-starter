const { Error: dbError } = require('mongoose');

/**
 * @description error formatters
 */

/**
 * @description returns any express error
 * in json format for the client
 */
/* eslint-disable */
const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message,
    errors: err.errors,
    type: err.type,
    stack: err.stack,
  };

  res.status(err.status);
  return res.json(response);
};

/**
 * @description converts other error formats to
 * a format that `handler` can use
 */
const converter = (err, req, res, next) => {
  let convertedError = err;
  if (err instanceof dbError) {
    convertedError.status = 500;
    convertedError.type = 'Database error';
  } else {
    convertedError.status = 500;
    convertedError.type = 'Operation error';
  }
  return handler(convertedError, req, res);
};

/**
 * @description handles 404 error
 */
const notFound = (req, res, next) => {
  const error = {};
  error.status = 404;
  error.message = 'Not found';
  error.type = 'Resource error';
  return handler(error, req, res);
};

module.exports = { handler, converter, notFound };
