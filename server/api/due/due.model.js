'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var StateSchema = new Schema({
  type: String,
  desc: String,
  date: Number,
  value: Number
});

var ReminderSchema = new Schema({
  date: Number,
  value: String,
  repeat: String,
  target: String,
  targettype: String
});

var DueSchema = new Schema({
  owner: String,                //= id utente proprietario
  type: String,                 //= 'in', 'out'
  name: String,                 //= desc 1
  info: String,                 //= desc 2
  date: Number,                 //= scadenza
  value: Number,                //= valore
  budgets: [String],            //= badgets di cui fa parte
  state: [StateSchema],         //= stati del pagamento
  reminds: [ReminderSchema],    //= reminder
  done: Boolean,                //= pagato/riscosso
  automatic: Boolean,           //= alla data passa in done automaticamente
  active: Boolean               //= attivo
}, { versionKey: false });

module.exports = mongoose.model('Due', DueSchema);


/*
  ANALISI:
  - dopo il 1° settembre vengono generati tutti gli item per l'anno successivo
*/
