/**
 * Created by Leo on 23/06/2015.
 */
'use strict';

var _ = require('lodash');
var Settings = require('./settings.model');
var u = require('../../utilities/util');

// Get a single settings
exports.show = function(req, res) {
  Settings.findOne({owner:req.user._id}, function (err, obj) {
    if(err) { return error(res, err); }
    if (obj) return res.json(obj);
    if(!obj) {
      obj = {
        owner: req.user._id,
        budget: '',
        chart: false
      };
      Settings.create(obj, function(err, stt) {
        if(err) { return error(res, err); }
        return res.json(stt);
      });
    }
  });
};

// Updates an existing target in the DB.
exports.update = function(req, res) {
  Settings.findOne({owner:req.user._id}, function (err, obj) {
    return u.updateex(req, res, err, obj);
  });
};


exports.remove = function(user) {
  if (!user || !user._id) return;
  Settings.find({owner: user._id}).remove();
};
