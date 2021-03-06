'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    coffee: {
      compile: {
        options: {
          bare: true
        },
        files: {
          'public/js/wdquiz.js': [
            'public/coffee/wdquiz.coffee',
            'public/coffee/wdquiz.config.coffee',
            'public/coffee/modules/*.coffee'
          ],
          'public/js/wdquiz.question.js': [
            'public/coffee/wdquiz.question.coffee',
            'public/coffee/models/wdquiz.question.*.coffee',
            'public/coffee/views/wdquiz.question.*.coffee'
          ],
          'public/js/wdquiz.admin.js': [
            'public/coffee/wdquiz.admin.coffee',
            'public/coffee/routers/wdquiz.admin.*.coffee',
            'public/coffee/models/wdquiz.admin.*.coffee',
            'public/coffee/views/wdquiz.admin.*.coffee'
          ],
          'public/js/wdquiz.answer.js': [
            'public/coffee/wdquiz.answer.coffee',
            'public/coffee/models/wdquiz.answer.*.coffee',
            'public/coffee/views/wdquiz.answer.*.coffee'
          ]
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