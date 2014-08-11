module.exports = function(grunt) {
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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
			views: {
				files: 'src/app/views/**',
				tasks: ['copy:views'],
				options: {
					interrupt: true,
				}
			},

			core: {
				files: 'src/core/*.js',
				tasks: ['concat:core'],
				options: {
					interrupt: true,
				}
			},

			controllers: {
				files: 'src/app/controllers/*.js',
				tasks: ['concat:controllers'],
				options: {
					interrupt: true,
				}
			},

			models: {
				files: 'src/app/models/*.js',
				tasks: ['concat:models'],
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

	grunt.registerTask('build', ['clean:build', 'copy', 'concat']);
	grunt.registerTask('default', ['build', 'watch']);
};
