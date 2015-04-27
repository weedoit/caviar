module.exports = function(grunt) {
	var PLUGINS = {
			JS: [],
			CSS: []
		};

	// Load plugins assets list
	(function() {
		var readJSON = grunt.file.readJSON,
			list = readJSON('plugins.json') || [],
			len = list.length,
			plugin,
			cur, 
			x;

		for (x = 0; x < len; x += 1) {
			cur = list[x];
			plugin = readJSON('plugins/' + cur + '/.caviar');

			plugin.assets.js.map(function (file) {
				PLUGINS.JS.push('plugins/' + cur + '/' + file);
			});

			plugin.assets.css.map(function (file) {
				PLUGINS.CSS.push('plugins/' + cur + '/' + file);
			});
		}
	})();

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			fonts: {
				expand: true,
				cwd: 'app/assets/fonts/',
				src: '**',
				dest: 'build/assets/fonts'
			},

			images: {
				expand: true,
				cwd: 'app/assets/images/',
				src: '**',
				dest: 'build/assets/images'
			},

			views: {
				expand: true,
				cwd: 'app/views/',
				src: '**',
				dest: 'build/assets/layouts'
			},

			structure: {
				src: 'app/index.html',
				dest: 'build/index.html'
			}
		},

		concat: {
			css: {
				dest: 'build/assets/css/caviar.css',
				src: ['app/assets/css/caviar.css'].concat(
					PLUGINS.CSS,
					['app/assets/css/app.css', 'app/assets/css/app-*.css']
				)
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
                    sourceMap: 'build/assets/js/app.min.js.map',
                    sourceMappingURL: 'app.min.js.map',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				files: {
					'build/assets/js/app.min.js': ['core/*.js', 'core/db/*.js'].concat(
						PLUGINS.JS,
						['app/controllers/*.js', 'app/models/*.js']
					)
				}
			},

			vendor: {
				options: {
                    sourceMap: 'build/assets/js/vendor.min.js.map',
                    sourceMappingURL: 'vendor.min.js.map'
				},
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
					'core/*.js',
					'core/db/*.js',
					'app/models/*.js',
					'app/controllers/*.js'
				],
				tasks: ['uglify:application']
			},

			plugins: {
				files: PLUGINS.JS,
				tasks: ['uglify:application'],
				options: {
					interrupt: true,
				}
			},

			views: {
				files: 'app/views/**',
				tasks: ['copy:views'],
				options: {
					interrupt: true,
				}
			},

			structure: {
				files: 'app/index.html',
				tasks: ['copy:structure'],
				options: {
					interrupt: true,
				}
			},

			css: {
				files: 'app/assets/css/**',
				tasks: ['concat:css'],
				options: {
					interrupt: true,
				}
			},

			css_plugins: {
				files: PLUGINS.CSS,
				tasks: ['concat:css'],
				options: {
					interrupt: true,
				}
			},

			images: {
				files: 'app/assets/images/**',
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