 module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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

          {src: 'bower_components/angular/angular.min.js', dest: 'js/angular.min.js' },
          {src: 'bower_components/angular-animate/angular-animate.min.js', dest: 'js/angular-animate.min.js' },

          /* not using bootstrap
          {expand: true, src: ['bower_components/bootstrap/dist/js/**.js'], dest: 'js/', flatten: true, filter: 'isFile'},
          {expand: true, src: ['bower_components/bootstrap/dist/css/**.css'], dest: 'css/', flatten: true, filter: 'isFile'},
          {expand: true, src: ['bower_components/bootstrap/dist/fonts/**'], dest: 'fonts/', flatten: true, filter: 'isFile'}*/
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

  // Tasks
  grunt.registerTask('default', ['copy', 'concat']);
};