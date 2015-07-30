'use strict';

var _ = require('lodash');
var Due = require('./due.model');
var u = require('../../utilities/util');


// Get list of targets
exports.index = function(req, res) {
  var filter = {
    owner: req.user._id,
    $where: 'this.date >= '+req.params.from+' && this.date <= '+req.params.to
  };
  return u.index(Due, req, res, filter);
};

// Get a single target
exports.show = function(req, res) {
  return u.get(Due, req, res);
};

// Creates a new target in the DB.
exports.create = function(req, res) {
  var due = req.body || {};
  due.type = due.type || 'out';
  due.owner = req.user._id;
  due.active = true;
  return u.create(Due, req, res);
};

// Elimina tutti i dati dell'utente
exports.clear = function(req, res) {
  u.clear(Due, req, res, { owner: req.user._id });
};

// Updates an existing target in the DB.
exports.update = function(req, res) {
  return u.update(Due, req, res);
};

// Deletes a target from the DB.
exports.destroy = function(req, res) {
  return u.destroy(Due, req, res);
};
