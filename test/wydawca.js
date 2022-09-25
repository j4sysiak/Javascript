#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex    = 'empik';
    var date  = new Date();
    var issue = (date.getMonth() + 1) + '/' + date.getFullYear();
    var msg   = process.argv.slice(2).join(' ') || "aktualne wydanie " + issue;

    ch.assertExchange(ex, 'fanout', {durable: false});
    ch.publish(ex, '', new Buffer(msg));
    console.log(" [x] Wysłano: %s", msg);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
