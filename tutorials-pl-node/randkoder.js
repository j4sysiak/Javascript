#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);
var numberOfArguments = 3;
var numberOfAttributes = 2;

if (args.length !== numberOfArguments) {
  console.log("Korzystanie: randkoder.js [imię] [płeć: k|m] [kolor włosów: blond|rude|siwe|czarne]");
  console.log("             randkoder.js Karolina k blond");
  process.exit(1);
}

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'randkomierz';
    var args = process.argv.slice(2);
    var name = args[0];
    var attributes = args.slice(1);
    var headersList = ['plec', 'kolor-wlosow'];
    var headersValues = {};

    for (var i=0; i<numberOfAttributes; i++) {
      var headerName  = headersList[i];
      var headerValue = attributes[i];

      headersValues[headerName] = headerValue;
    }

    ch.assertExchange(ex, 'headers', {durable: false});
    ch.publish(ex, '', new Buffer(name), {headers: headersValues});

    console.log(" [x] Wysłano profil '%s'", name);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});