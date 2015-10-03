var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var queue = new AWS.SQS({
    region: 'us-west-2',
    params: {
        QueueUrl: 'https://sqs.us-west-2.amazonaws.com/955537546004/order_processing'
    }
});

exports.handler = function(event, context) {
    var message = event.Records[0].Sns.Message;
    var data = JSON.parse(message);
    
    data.order.id = event.Records[0].Sns.MessageId;
    data.order.subTotal = data.order.items.map(function(item) {
        return item.price * item.quantity;
    }).reduce(function(total, item) {
        return total + item;
    }, 0);
    data.order.taxes = data.order.subTotal * 0.2;
    data.order.total = data.order.subTotal + data.order.taxes;
    
    dynamodb.putItem({
        "TableName": "Orders",
        "Item": {
            "Id": { "S": data.order.id },
            "CustomerName": { "S": data.order.customer_name },
            "CustomerEmail": { "S": data.order.customer_email },
            "Items": { "S": JSON.stringify(data.order.items) },
            "SubTotal": { "N": data.order.subTotal.toString() },
            "Taxes": { "N": data.order.taxes.toString() },
            "Total": { "N": data.order.total.toString() }
        }
    }, function(err, results) {
        if (err) context.fail(err);
        else {
            queue.sendMessage({
                MessageBody: JSON.stringify(data)
            }, function(err, data) { 
                if (err) context.fail(err);
                else context.succeed(data);
            });
        }
    });
};
