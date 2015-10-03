require('es6-promise').polyfill();

var AWS = require('aws-sdk');
var less = require('less');
var postcss = require('postcss');

var s3 = new AWS.S3();
var outputBucket = 'tutsplus--css-files';

exports.handler = function (event, context) {
  var source = event.source;
  var outputFileName = event.fileName;

  less.render(source, function (err, output) {
    if (err) context.fail(err);

    postcss([require('autoprefixer'), require('cssnano')]).process(output.css).then(function (result) {
      s3.putObject({
        Bucket: outputBucket,
        Key: outputFileName,
        Body: result.css,
        ContentType: 'text/css'
      }, function (err, result) {
        if (err) context.fail(err);
        else context.succeed(result);
      });
    });
  });
}
