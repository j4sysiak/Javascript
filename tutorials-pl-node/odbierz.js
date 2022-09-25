#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Oczekiwanie na wiadomości w %s.", q);
    console.log("     Naciśnij CTRL+C aby zakończyć.");
    ch.consume(q, function(msg) {
      console.log(" [x] Odebrano %s", msg.content.toString());
    }, {noAck: true});
  });
});