#!/usr/bin/env node
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'task_queue';
    var msg = process.argv.slice(2).join(' ') || "Witamy!";

    ch.assertQueue(q, {durable: true});
    ch.sendToQueue(q, new Buffer(msg));
    console.log(" [x] Wysłano '%s'", msg);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});