var async = require('async');
var AWS = require('aws-sdk');
var ses = new AWS.SES({ region: 'us-west-2' });

exports.handler = function(event, context) {
  async.each(event.Records, function(record, next) {
    if (record.eventName !== 'INSERT') return next();

    var order = record.dynamodb.NewImage;

    ses.sendEmail({
        Destination: {
          ToAddresses: [order.CustomerEmail.S],
        },
        Message: {
          Body: {
            Html: {
              Data: "<p>Dear " + order.CustomerName.S + "!</p><p>Thank you for your order!</p><p>All the best,<br>Markus</p>",
              Charset: "UTF-8"
            },
            Text: {
              Data: "Dear " + order.CustomerName.S + "!\n\nThank you for your order!\n\nAll the best,\nMarkus",
              Charset: "UTF-8"
            }
          },
          Subject: {
            Data: "Your Order #" + order.Id.S,
            Charset: "UTF-8"
          }
        },
        Source: 'no-reply@mmuehlberger.com'
      }, function (err, data) {
        next(err);
      });
  }, function(err) {
    if (err) return context.fail(err);
    return context.succeed();
  })
}
