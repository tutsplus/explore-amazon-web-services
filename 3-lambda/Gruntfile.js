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
    default: {}
  },
  lambda_deploy: {
    default: {
      function: 'compileAndMinifyCSS'
    }
  }
});

grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);
