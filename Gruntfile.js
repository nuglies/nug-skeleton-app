'use strict'

module.exports = (grunt) => {

    // converts .scss files to .css files
    grunt.loadNpmTasks('grunt-contrib-sass')

    // monitors .scss files for changes and runs the sass task if they change
    grunt.loadNpmTasks('grunt-contrib-watch')

    // runs our little express server from grunt
    grunt.loadNpmTasks('grunt-express-server')


    grunt.initConfig({

        express: {
            options: {
                script: 'server/server.js'
            },
            main: {}
        },

        watch: {
            sass: {
                files: [
                    'client/sass/*.{scss,sass}'
                ],
                tasks: ['sass:main']
            },
            express: {
                files: [
                    'server/server.js'
                ],
                tasks: ['express'],
                options: {
                    spawn: false
                }

            }
        },

        sass: {
            options: {
                debugInfo: true,
                noCache: true
            },
            main: {
                files: [{
                    expand: true,
                    cwd: 'client/sass',
                    src: ['*.scss'],
                    dest: 'client/css',
                    ext: '.css'
                }]
            }
        }
    })

    grunt.registerTask('serve', [
        'express',
        'watch'
    ])

    grunt.registerTask('default', ['serve'])
    grunt.registerTask('heroku', ['sass'])
}
