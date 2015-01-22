module.exports = function(grunt) {
    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            // 2. Configuration for concatinating files goes here
            dist: {
                src: [
                    'js/*/*.js', // All JS in the JS folder
                    'js/*.js' // Custom JS
                ],
                dest: 'public/js/production.js', // The production file
            }
        },
        uglify: {
            // Configuration for uglifying files goes here
            build: {
                src: 'public/js/production.js', // Grab prod file from above
                dest: 'public/js/production.min.js' // Minified output
            }
        },
        imagemin: {
            // Configuration for imagemin
            dynamic: {
                files: [{
                    expand: 'public/images/',
                    cwd: 'public/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'public/images/build/'
                }]
            }
        },
        sass: {
            dist: {
                // Compiles SASS
                options: {
                    style: 'compressed' // Minify CSS output
                },
                files: {
                    'public/css/style.css': 'sass/style.scss'
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/*.js', 'js/*/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            }, 
            css: {
                files: ['sass/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                }
            },
            options: {
                livereload: 3333,
            }
        }
    });
 
    // 3. Where we tell Grunt we plan to use this plug-in
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
 
    // 4. Where we tell Grunt what to do when we type "grunt"
    grunt.registerTask('default', ['concat', 'uglify', 'imagemin','sass', 'watch']);
}