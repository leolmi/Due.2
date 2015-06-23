/* Created by Leo on 23/06/2015. */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SettingsSchema = new Schema({
  owner: String,
  budget: String,
  chart: Boolean,
  notifies: Boolean
}, { versionKey: false });

module.exports = mongoose.model('Settings', SettingsSchema);
