#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Korzystanie: notowania-gpw-subskrybent.js <klucz-1> <klucz-2>");
  console.log("  ./notowania-gpw-subskrybent.js gpw.notowania.spolki.kghm");
  console.log("  ./notowania-gpw-subskrybent.js gpw.new-connect.*");
  console.log("  ./notowania-gpw-subskrybent.js gpw.#");

  process.exit(1);
}

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'notowania-gpw';

    ch.assertExchange(ex, 'topic', {durable: false});

    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(" [*] Oczekiwanie na wiadomości.");
      console.log("     Naciśnij CTRL+C aby zakończyć.");

      args.forEach(function(key) {
        ch.bindQueue(q.queue, ex, key);
      });

      ch.consume(q.queue, function(msg) {
        console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
      }, {noAck: true});
    });
  });
});
