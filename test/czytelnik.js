#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'empik';

    ch.assertExchange(ex, 'fanout', {durable: false});

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(" [*] Oczekiwanie na wydanie w %s.", q.queue);
      console.log("     Naciśnij CTRL+C aby zakończyć.");
      ch.bindQueue(q.queue, ex, '');

      ch.consume(q.queue, function(msg) {
        console.log(" [x] Odebrano %s", msg.content.toString());
      }, {noAck: true});
    });
  });
});
