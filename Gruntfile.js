var fork = require('child_process').fork;
var spawn = require('child_process').spawn;
var env = process.env;
var worker;

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//------------------------------------------------------
		// Less
		//------------------------------------------------------
		less: {
			development: {
				options: {
					paths: ['./public/assets/css', './public/assets/css/admin', './public/themes'],
					compress: false
				},				
				files: {
					'./public/assets/css/main.css': ['./public/assets/css/global.less', './client/**/*.less', './server/**/*.less']
				}
			},
		},

		//------------------------------------------------------
		// Minify JS
		//------------------------------------------------------
		uglify: {
			development: {
				options: {
					beautify: true,
					mangle: false,
					compress: false,
				},
				files: {
					'./public/assets/js/main.js': ['./public/assets/js/myApp.js', './client/*.js', './client/**/*.js', './shared/*.js', './shared/**/*.js'],
				}
			},
		},

		//------------------------------------------------------
		// Watch file changes
		//------------------------------------------------------
		watch: {
			less: {
				files: [
					'./server/**/*.less',
					'./public/**/*.less',
					'./client/**/*.less',
				],
				tasks: ['less']
			},
			clientJS: {
				files: [
					'./client/**/*.js', './shared/**/*.js', 
				],
				tasks: ['uglify']
			},
			html: {
				files: ['./client/**/*.html'],
			},
			serverJS: {
				files: [

					//Server side JS
					'./server/**/*.js', './shared/**/*.js', 
					'./*.js', './*.json', 
				],
			},
			options: {
				spawn: false, //Was true
			},
		},

		//------------------------------------------------------
		// eslint
		//------------------------------------------------------
		eslint: {
			options: {
				configFile: '.eslintrc.json',
			},
			target: [
				'server/**/*.js',
			]
		}
	});

	//Plugins
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-concurrent');

	// Default task(s).
	grunt.registerTask('build', ['eslint', 'less', 'uglify']);
	grunt.registerTask('default', ['build', 'watch']); //'concurrent:watchAndRun']);

	//A file was updated
	function update(action, filepath, target) {
		console.log('+ grunt.update(%s, %s, %s)', action, filepath, target);
		console.log('+');

		if (target === 'apps') {
			console.log('+ -----> Updating MarketSpace apps...');
			grunt.task.run(['exec:updateApps']);
		}

		if (target === 'serverJS') {
			restartWorker();

		} else if (target === 'clientJS') {
			console.log('+ -----> Client JS updating...');

		} else if (target === 'html') {
			console.log('+ -----> HTML updating...');

		} else if (target === 'less') {
			console.log('+ -----> LESS updating...');
		}
	}

	//Start/restartWorker
	function restartWorker() {

		//First time, start the MarketSpace worker process
		if (!worker) {
			console.log('+ -----> Starting MarketSpace...');
		} else {
			console.log('+ -----> Restarting MarketSpace...');
			worker.kill();
		}
		console.log('+');
		worker = fork('server.js', [], { env: env });
		//worker = fork('nf start', [], { env: env });
		//worker = spawn('nf start -j Procfile-dev', [], { env: env });
	}

	//Watch for changes to files
	grunt.event.on('watch', update);

	//Start
	restartWorker();
};