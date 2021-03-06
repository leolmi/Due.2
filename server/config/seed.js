/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var u = require('../utilities/util');
var User = require('../api/user/user.model');
var Settings = require('../api/settings/settings.model');
var Due = require('../api/due/due.model');

User.find({}).remove(function() {
  User.create({
    _id: '54b3e04cde6279a8211b42fe',
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    _id: '54b3e04cde6279a8211b42fd',
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
  });
});

Settings.find({}).remove(function() {
  Settings.create({
    owner: '54b3e04cde6279a8211b42fe',
    budget: 'Default',
    chart: true
  },{
    owner: '54b3e04cde6279a8211b42fd',
    budget: 'BDG',
    chart: false
  }, function() {
    console.log('finished populating settings');
  });
});

var now = new Date();

var d1 = u.dateToDays(u.getDate(now.getFullYear(),now.getMonth()+1,15));
var d2 = u.dateToDays(u.getDate(now.getFullYear(),now.getMonth()+1,6));
var d3 = u.dateToDays(u.getDate(now.getFullYear(),now.getMonth()+1,14));
var d4 = u.dateToDays(u.getDate(now.getFullYear(),now.getMonth()+1,24));

Due.find({}).remove(function() {
  Due.create({
    owner: '54b3e04cde6279a8211b42fd',
    type: 'out',
    name: 'pagamento 00',
    date: d4,
    budgets: ['Casa'],
    value: 260.00
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'in',
    name: 'a nero',
    date: d1,
    value: 20.00
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'in',
    name: 'stipendio',
    date: d1,
    value: 1000.99,
    automatic: true
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'out',
    name: 'pagamento 01',
    date: d2,
    budgets: ['Sbobba','Ciborio','Palla'],
    value: 150.23
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'out',
    name: 'pagamento 03',
    date: d2,
    value: 50.00
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'out',
    name: 'pagamento 05',
    date: d2,
    value: 10.89,
    budgets: ['Zinne'],
    state:[{
      date:d3,
      value:10.89,
      desc:'Home banking'
    }]
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'out',
    name: 'pagamento 02',
    date: d3,
    budgets: ['Default','Bobo'],
    value: 100.02
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'out',
    name: 'pagamento 04',
    date: d3,
    value: 89.04,
    budgets: ['Default','Home'],
    state:[{
      date:d1,
      value:50.00,
      desc:'contanti'
    }]
  }, function() {
      console.log('finished populating dues. d1='+d1+'  d2='+d2+'  d3='+d3);
  });
});
