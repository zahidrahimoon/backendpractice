var amqp = require('amqplib/callback_api');
var readline = require('readline');

var queue = 'hello';

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(queue, {
      durable: false
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'Enter message> '
    });

    rl.prompt();

    rl.on('line', function(line) {
      var msg = line.trim();
      if (msg.length > 0) {
        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
      }
      rl.prompt();
    }).on('close', function() {
      connection.close();
      process.exit(0);
    });
  });
});