/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var u = require('../utilities/util');
var User = require('../api/user/user.model');
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

var d1 = u.dateToDays(u.getDate(2015,6,15));
var d2 = u.dateToDays(u.getDate(2015,6,6));
var d3 = u.dateToDays(u.getDate(2015,6,14));

Due.find({}).remove(function() {
  Due.create({
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
    value: 100.02
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'out',
    name: 'pagamento 04',
    date: d3,
    value: 89.04,
    state:[{
      date:d1,
      value:50.00,
      desc:'contanti'
    }]
  }, function() {
      console.log('finished populating dues. d1='+d1+'  d2='+d2+'  d3='+d3);
  });
});
