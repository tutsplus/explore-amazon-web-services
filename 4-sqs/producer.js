var AWS = require('aws-sdk');

var queue = new AWS.SQS({
  region: 'us-west-2',
  params: {
    QueueUrl: 'https://sqs.us-west-2.amazonaws.com/955537546004/order_processing'
  }
});

var order = {
  id: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
  customer_name: 'Jane Doe',
  customer_email: 'markus@mmuehlberger.com',
  items: [
    { id: 1, price: 9.90, quantity: 2 },
    { id: 2, price: 19.90, quantity: 3 }
  ],
  subtotal: 79.50,
  taxes: 15.90,
  total: 95.40
};

queue.sendMessage({
  MessageBody: JSON.stringify({ order: order })
}, function(err, data) {
  if (err) console.error(err)
  else console.log(data)
});
