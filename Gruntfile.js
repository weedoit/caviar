module.exports = function(grunt) {
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			images: {
				expand: true,
				cwd: 'src/assets/images/',
				src: '**',
				dest: 'build/assets/images'
			},

			views: {
				expand: true,
				cwd: 'src/app/views/',
				src: '**',
				dest: 'build/assets/layouts'
			},

			structure: {
				src: 'src/app/index.html',
				dest: 'build/index.html'
			}
		},

		concat: {
			css: {
				dest: 'build/assets/css/caviar.css',
				src: [
					'src/assets/css/caviar.css',
					'src/assets/css/caviar-transitions.css',
					'src/assets/css/caviar-transitions-*.css',
					'src/assets/css/app.css',
					'src/assets/css/app-*.css'
				]
			},

			vendor: {
				dest: 'build/assets/css/vendor.css',
				src: grunt.file.readJSON('vendor.json').css
			}
		},

		clean: {
			build: ['build/**']
		},

		uglify: {
			application: {
				options: {
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				files: {
					'build/assets/js/app.min.js': [
						'src/core/*.js',
						'src/app/controllers/*.js',
						'src/app/models/*.js'
					]
				}
			},

			vendor: {
				files: {
					'build/assets/js/vendor.min.js': grunt.file.readJSON('vendor.json').js
				}
			}
		},

		watch: {
			core: {
				options: {
					interrupt: true,
				},
				files: [
					'src/core/*.js',
					'src/app/models/*.js',
					'src/app/controllers/*.js'
				],
				tasks: ['uglify:application']
			},

			views: {
				files: 'src/app/views/**',
				tasks: ['copy:views'],
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

			css: {
				files: 'src/assets/css/**',
				tasks: ['concat:css'],
				options: {
					interrupt: true,
				}
			},

			images: {
				files: 'src/assets/images/**',
				tasks: ['copy:images'],
				options: {
					interrupt: true,
				}
			},

			images: {
				files: 'src/vendor/**',
				tasks: ['copy:images'],
				options: {
					interrupt: true,
				}
			}
		},

		bump: {
			options: {
				files: ['package.json'],
				updateConfigs: [],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json'],
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false
			}
		}
	});

	grunt.registerTask('release', ['bump']);
	grunt.registerTask('build', ['clean:build', 'copy', 'concat', 'uglify']);	
	grunt.registerTask('default', ['build', 'watch']);
};


