module.exports = function(grunt) {
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		coffee: {
			core: {
				expand: true,
				flatten: true,
				cwd: 'src/core/',
				src: ['**.coffee'],
				dest: 'src/core/',
				ext: '.js'
			},

			controllers: {
				expand: true,
    			flatten: true,
				cwd: 'src/app/controllers/',
			    src: ['*.coffee'],
			    dest: 'src/app/controllers/',
			    ext: '.js'
			},

			models: {
				expand: true,
				flatten: true,
				cwd: 'src/app/models/',
				src: ['*.coffee'],
				dest: 'src/app/models/',
				ext: '.js'
			}
		},

		copy: {
			assets: {
				expand: true,
				cwd: 'src/assets/',
				src: '**',
				dest: 'build/assets'
			},

			views: {
				expand: true,
				cwd: 'src/app/views/',
				src: '**',
				dest: 'build/assets/layouts'
			},

			vendor: {
				expand: true,
				cwd: 'src/vendor/',
				src: '**',
				dest: 'build/vendor/'
			},

			structure: {
				src: 'src/app/index.html',
				dest: 'build/index.html'
			}
		},

		concat: {
			css: {
				dest: 'build/assets/css/caviar.css',
				src: ['src/assets/css/caviar*.css']
			},
			css_app: {
				dest: 'build/assets/css/app.css',
				src: ['src/assets/css/app*.css']
			},
			core: {
				dest: 'build/assets/js/caviar.js',
				src: ['src/core/*.js']
			},
			controllers: {
				dest: 'build/assets/js/controllers.js',
				src: ['src/app/controllers/*.js']
			},
			models: {
				dest: 'build/assets/js/models.js',
				src: ['src/app/models/*.js']
			}
		},

		clean: {
			js: ['src/core/*.js'],
			build: ['build/**']
		},

		watch: {
			coffee: {
				files: 'src/app/**/*.coffee',
				tasks: ['coffee:controllers', 'coffee:models'],
				options: {
			    	interrupt: true,
			    }
			},

			core_coffee: {
				files: 'src/core/*.coffee',
				tasks: ['coffee:core', 'concat:core', 'clean:js'],
				options: {
					interrupt: true,
				}
			},

			views: {
				files: 'src/app/views/**',
				tasks: ['copy:views'],
				options: {
					interrupt: true,
				}
			},

			app: {
				files: 'src/app/**/*.js',
				tasks: ['concat'],
				options: {
					interrupt: true,
				}
			},

			structure: {
				files: 'src/app/index.html',
				tasks: ['copy:structure'],
				options: {
					interrupt: true,
				}
			},

			assets: {
				files: 'src/assets/**',
				tasks: ['copy:assets', 'concat:css', 'concat:css_app'],
				options: {
					interrupt: true,
				}
			},

			vendors: {
				files: 'src/vendors/**',
				tasks: ['bower_concat'],
				options: {
					interrupt: true,
				}
			}
			
		}
	});

	grunt.registerTask('build', ['clean:build', 'coffee', 'copy', 'concat', 'clean:js']);
	grunt.registerTask('default', ['build', 'watch']);
};
