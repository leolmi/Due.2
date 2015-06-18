/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

// var Thing = require('../api/thing/thing.model');
var u = require('../utilities/util');
var User = require('../api/user/user.model');
var Due = require('../api/due/due.model');

// Thing.find({}).remove(function() {
//   Thing.create({
//     name : 'Development Tools',
//     info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
//   }, {
//     name : 'Server and Client integration',
//     info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
//   }, {
//     name : 'Smart Build System',
//     info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
//   },  {
//     name : 'Modular Structure',
//     info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
//   },  {
//     name : 'Optimized Build',
//     info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
//   },{
//     name : 'Deployment Ready',
//     info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
//   }, function() {
//     console.log('finished populating things');
//   });
// });

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
    value: 20.00,
    active:true
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'in',
    name: 'stipendio',
    date: d1,
    value: 1000.99,
    active:true
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'out',
    name: 'pagamento 01',
    date: d2,
    value: 150.23,
    active:true
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'out',
    name: 'pagamento 03',
    date: d2,
    value: 50.00,
    active:true
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'out',
    name: 'pagamento 05',
    date: d2,
    value: 10.89,
    active:true,
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
    value: 100.02,
    active:true
  },{
    owner: '54b3e04cde6279a8211b42fe',
    type: 'out',
    name: 'pagamento 04',
    date: d3,
    value: 89.04,
    active:true
  }, function() {
      console.log('finished populating dues. d1='+d1+'  d2='+d2+'  d3='+d3);
  });
});