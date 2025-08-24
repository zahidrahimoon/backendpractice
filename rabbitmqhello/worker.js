var amqp = require('amqplib/callback_api');

var queue = 'task_queue';

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(queue, {
      durable: true
    });

    channel.prefetch(1); // Fair dispatch: one message at a time per worker

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, function(msg) {
      var secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        channel.ack(msg); // Manual acknowledgment
      }, secs * 1000);
    }, {
      noAck: false // Manual acknowledgment mode
    });
  });
});