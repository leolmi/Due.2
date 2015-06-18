/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Due = require('./due.model');

exports.register = function(socket) {
  Due.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Due.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('due:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('due:remove', doc);
}