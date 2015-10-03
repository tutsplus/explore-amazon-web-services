var grunt = require('grunt');
grunt.loadNpmTasks('grunt-aws-lambda');

grunt.initConfig({
  lambda_invoke: {
    default: {
      options: {
        file_name: 'index.js'
      }
    }
  },
  lambda_package: {
    default: {
    }
  },
  lambda_deploy: {
    default: {
      arn: 'arn:aws:lambda:us-west-2:955537546004:function:sendOrderEmails'
    }
  }
});

grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);
