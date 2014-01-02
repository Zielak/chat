 module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        grep: '*-test',
        ui: 'bdd',
        reporter: 'tap'
      },

      all: { src: ['test/**/*.js'] }
    },

    concat: {
      options: {
        separator: "\n\n\n"
      },
      css: {
        src: [
          'client-src/css/responsive.gs.12col.css',
          'client-src/css/app.css',
          'bower_components/AngularJS-Toaster/toaster.css'
        ],
        dest: 'client/css/app.css'
      },
      js: {
        src: [
          'client-src/js/chat.js',
          'client-src/js/controllers.js',
          'client-src/js/directives.js',
          'client-src/js/filters.js',
          'client-src/js/services.js',
        ],
        dest: 'client/js/chat.js'
      }
    },

    copy: {
      main: {
        files: [
          {src: 'client-src/js/app.js', dest: 'client/js/app.min.js' },
          {
            expand: true,
            src: ['client-src/directives/**.html'],
            dest: 'client/directives/',
            flatten: true,
            filter: 'isFile'
          },

          {
            src: 'bower_components/angular/angular.js',
            dest: 'client/js/angular.js'
          },
          {
            src: 'bower_components/angular/angular.min.js',
            dest: 'client/js/angular.min.js'
          },
          {
            src: 'bower_components/angular/angular.min.js.map',
            dest: 'client/js/angular.min.js.map'
          },
          {
            src: 'bower_components/angular-animate/angular-animate.js',
            dest: 'client/js/angular-animate.js'
          },
          {
            src: 'bower_components/angular-animate/angular-animate.min.js',
            dest: 'client/js/angular-animate.min.js'
          },
          {
            src: 'bower_components/angular-animate/angular-animate.min.js.map',
            dest: 'client/js/angular-animate.min.js.map'
          },
          {
            src: 'bower_components/angular-socket-io/socket.js',
            dest: 'client/js/socket.js' },
          {
            src: 'bower_components/AngularJS-Toaster/toaster.js',
            dest: 'client/js/toaster.js'
          },
          {
            src: 'node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js',
            dest: 'client/js/socket.io.js'
          },

        ]
      }
    }
  });

  // Load plugins.
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-jade');
  //grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-simple-mocha');

  // Tasks
  grunt.registerTask('default', ['simplemocha', 'copy', 'concat']);
};
