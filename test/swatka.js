#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'randkomierz';

    ch.assertExchange(ex, 'headers', {durable: false});

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(' [*] Oczekiwanie na wiadomości w:');
      console.log('     %s', q.queue);
      console.log("     Naciśnij CTRL+C aby zakończyć.");

      ch.bindQueue(q.queue, ex, '', {
        'x-match': 'all',
        'plec': 'k',
        'kolor-wlosow': 'czarne'
      });

      ch.consume(q.queue, function(msg) {
        console.log(" [x] '%s' pasuje do Ciebie", msg.content.toString());
      }, {noAck: true});
    });
  });
});
