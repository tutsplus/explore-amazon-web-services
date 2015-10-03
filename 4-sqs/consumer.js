var AWS = require('aws-sdk');
var Consumer = require('sqs-consumer');

var app = Consumer.create({
  queueUrl: 'https://sqs.us-west-2.amazonaws.com/955537546004/order_processing',

  handleMessage: function (message, done) {
    var data = JSON.parse(message.Body);

    console.log("Processing order " + data.order.id);

    done();
  }
});

app.on('error', function (err) {
  console.err(err);
});

app.start();
