#!/usr/bin/env node

var amqp = require('amqplib/callback_api'); 

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'task_queue';

    ch.assertQueue(q, {durable: true});
    ch.prefetch(1);
    console.log(" [*] Oczekiwanie na wiadomości w %s.", q);
    console.log("     Naciśnij CTRL+C aby zakończyć.");

    ch.consume(q, function(msg) {
      var secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Odebrano %s", msg.content.toString());

      setTimeout(function() {
        ch.ack(msg);
        console.log(" [x] Potwierdzono odbiór");
      }, secs * 1000);
    }, {noAck: false});
  });
});