/**
 * Created by Leo on 14/03/2015.
 */
'use strict';

var _ = require('lodash');

/**
 * Return standard 200
 * @param res
 * @param obj
 * @returns {*}
 */
var ok = function(res, obj) {return res.json(200, obj);};
exports.ok = ok;

/**
 * Return standard 201
 * @param res
 * @param obj
 * @returns {*}
 */
var created = function(res, obj) {return res.json(201, obj);};
exports.created = created;

/**
 * Return standard 204
 * @param res
 * @returns {*}
 */
var deleted = function(res) {return res.json(204);};
exports.deleted = deleted;

/**
 * Return standard 404
 * @param res
 * @returns {*}
 */
var notfound = function(res) {return res.send(404); };
exports.notfound = notfound;

/**
 * Return standard 500
 * @param res
 * @param err
 * @returns {*}
 */
var error = function(res, err) { return res.send(500, err); };
exports.error = error;


exports.update = function(schema, req, res) {
  if(req.body._id) { delete req.body._id; }
  schema.findById(req.params.id, function (err, obj) {
    if (err) { return error(res, err); }
    if(!obj) { return notfound(res); }

    var updated = _.merge(obj, req.body, function(a,b){
      return _.isArray(a) ? b : undefined;
    });
    updated.save(function (err) {
      if (err) { return error(res, err); }
      return ok(res, obj);
    });
  });
};

exports.create = function(schema, req, res) {
  schema.create(req.body, function(err, obj) {
    if(err) { return error(res, err); }
    return created(res, obj);
  });
};

exports.destroy = function(schema, req, res) {
  schema.findById(req.params.id, function (err, obj) {
    if(err) { return error(res, err); }
    if(!obj) { return notfound(res); }
    obj.remove(function(err) {
      if(err) { return error(res, err); }
      return deleted(res);
    });
  });
};

exports.get = function(schema, req, res) {
  schema.findById(req.params.id, function (err, obj) {
    if(err) { return error(res, err); }
    if(!obj) { return notfound(res); }
    return res.json(obj);
  });
};

exports.index = function(schema, req, res, filter) {
  schema.find(filter, function (err, objs) {
    console.log('Trovati: '+objs.length+' elementi.');
    if(err) { return error(res, err); }
    return ok(res, objs);
  });
};

exports.uiid_templates = {
  guid: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
  id12: 'xxxxxxxxxxxx'
};

exports.uuid = function(template) {
  template = template || 'xxxxxxxxxxxx';
  var d = new Date().getTime();
  var id = template.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return id;
};


exports.dateToDays = function(d) {
  return Math.floor((((d.getTime() / 1000) / 60) / 60) / 24+1);
};

exports.daysToDate = function(n) {
  return new Date(n*24*60*60*1000);
};

exports.getDate = function(y,m,d) {
  return new Date(y,m-1,d,0,0,0,0);
};
