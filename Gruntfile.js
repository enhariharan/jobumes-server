'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*-test.js'],
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },

    apidoc: {
      myapp: {
        src: "./lib/controllers",
        dest: "./doc/apidoc/",
        options : {
          excludeFilters: [
            "./lib/app/",
            "./lib/models/",
            "./lib/security/",
            "./lib/services/",
            "./lib/views/",
            "node_modules/",
            "temp/",
            "test/",
          ],
          debug: true,
        }
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
  });

  // These plugins provide necessary tasks.
  [
    'grunt-contrib-jshint',
    'grunt-contrib-watch',
    'grunt-apidoc',
  ].forEach(function(task) { grunt.loadNpmTasks(task); });

  // Default task.
  grunt.registerTask('default', ['jshint', 'watch', 'apidoc']);
};
