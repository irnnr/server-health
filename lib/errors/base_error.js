'use strict';

const restErrors = require('restify-errors');
const boom = require('@hapi/boom');

const internals = {};

internals.lowerizeFirstLetter = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

module.exports = class BaseError extends Error {
  /**
   * Cast error to a restify error
   * @returns {RestError} error - restify error instance
   */
  toRestifyError() {
    return new restErrors[this.name](this.message);
  }

  /**
   * Cast the error to a boom error
   * Make sure the output payload match the restify error output
   * @returns {Boom} error - boom error instance
   */
  toBoomError() {
    const code = this.name.replace('Error', '');
    const error = boom[internals.lowerizeFirstLetter(code)](this.message);
    error.output.payload = JSON.stringify(this);

    return error;
  }

  /**
   * Json formatted object
   * @returns {{message: string, name: string, code}} -
   */
  toJSON() {
    const code = this.name.replace('Error', '');

    return {
      message: this.message,
      code: code,
    };
  }
};
