 module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '//! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:MM") %>\n'
      },
      build: {
        /*files: [
          {expand: true, src: ['src/js/*.js'], dest: 'js/', ext: '.js', flatten: true}
        ]*/
        /*src: [
          'src/js/app.js', 'src/js/controllers.js', 'src/js/directives.js'
        ],
        dest: 'js/app.min.js'*/
      }
    },
    jade: {
      compile: {
        files: {
          "index.html": ["src/view/index.jade"]
        }
      }
    },
    copy: {
      main: {
        files: [
          {src: 'src/scss/main.css', dest: 'css/main.css' },
          {src: 'src/js/app.js', dest: 'js/app.min.js' },
          {expand: true, src: ['src/directives/**.html'], dest: 'directives/', flatten: true, filter: 'isFile'},


          {src: 'bower_components/angular/angular.min.js', dest: 'js/angular.min.js' },
          {src: 'bower_components/angular/angular.js', dest: 'js/angular.js' },

          {src: 'bower_components/angular-animate/angular-animate.js', dest: 'js/angular-animate.js' },

          {expand: true, src: ['bower_components/bootstrap/dist/js/**.js'], dest: 'js/', flatten: true, filter: 'isFile'},
          {expand: true, src: ['bower_components/bootstrap/dist/css/**.css'], dest: 'css/', flatten: true, filter: 'isFile'},
          {expand: true, src: ['bower_components/bootstrap/dist/fonts/**'], dest: 'fonts/', flatten: true, filter: 'isFile'}
        ]
      }
    },
    concat: {
      options: {
        separator: "\n\n\n"
      },
      dist: {
        src: [
          'src/css/responsive.gs.12col.css',
          'src/app.css',
          'bower_components/AngularJS-Toaster/toaster.css'
        ],
        dest: 'client/css/app.css'
      }
    }
  });

  // Load plugins.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Tasks
  grunt.registerTask('default', ['uglify', 'jade', 'copy', 'concat']);
};