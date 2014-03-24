 module.exports = function (grunt) {
    'use strict';
    var cwd = 'src';
    var buildDir = 'dist';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            source: {
                files: [{
                    expand: true,
                    cwd: cwd,
                    src: ['**/*.css.scss'],
                    dest: buildDir,
                    ext: '.css',
                }]
            }
        },
        jade: {
            options: {
                pretty: true
            },
            source: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: cwd,
                    src: ['**/*.html.jade'],
                    dest: buildDir,
                    ext: '.html'
                }]
            }
        },
        coffee: {
            source: {
                expand: true,
                cwd: cwd,
                src: ['**/*.js.coffee'],
                dest: buildDir,
                ext: '.js'
            },
            server: {
                src: 'server.coffee',
                dest: 'server.js'
            }
        },
        watch: {
            sass: {
                files: [cwd + '/**/*.scss'],
                tasks: ['sass:source'],
                options: {
                    spawn: false
                }
            },
            jade: {
                files: [cwd + '/**/*.jade'],
                tasks: ['jade:source'],
                options: {
                    spawn: false
                }
            },
            coffee: {
                files: [cwd + '/**/*.coffee'],
                tasks: ['coffee:source'],
                options: {
                    spawn: false
                }
            }
        },
        'gh-pages': {
            options: {
                base: buildDir
            },
            src: '**/*'
        }
    });

    // Load the required plugins.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-gh-pages');

    // Tasks.
    grunt.registerTask('default', ['sass', 'jade', 'coffee:source']);
    grunt.registerTask('dist', ['default', 'gh-pages']);
    grunt.registerTask('server', ['coffee:server']);
};
