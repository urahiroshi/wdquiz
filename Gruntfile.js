'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    coffee: {
      compile: {
        options: {
          bare: true
        },
        files: {
          'public/js/wdquiz.js': ['public/coffee/wdquiz.coffee', 'public/coffee/wdquiz.config.coffee', 'public/coffee/modules/*.coffee'],
          'public/js/wdquiz.question.js': ['public/coffee/wdquiz.question.coffee',
                                           'public/coffee/models/wdquiz.question.*.coffee',
                                           'public/coffee/views/wdquiz.question.*.coffee']
        }
      }
    },
    jst: {
      compile: {
        options: {
          processName: function(fileName) {
            return fileName.replace(/(public\/templates\/|.html)/g, '');
          }
        },
        files: {
          'public/js/templates.js': ["public/templates/*.html"]
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.registerTask('default', ['coffee', 'jst']);
};