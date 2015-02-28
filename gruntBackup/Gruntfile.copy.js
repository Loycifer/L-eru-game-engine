
module.exports = function(grunt) {
    // Project configuration.
    var projectPath = 'eru-game-engine/';
    var sourcePath = projectPath + 'source/';
    var tempPath = 'tempGrunt/';
    var outPath = projectPath + 'build/Ludix/';
    var gruntOutPath = projectPath + 'gruntBackup/';

    var fileNames = [
	'L-preload.js',
	'L.js',
	'L-setup.js',
	'L-mouse.js',
	'L-display.js',
	'L-audio.js',
	'L-sprite.js',
	'L-layer.js',
	'L-scene.js',
	'L-textbox.js',
	'L-transition.js',
	'L-keymap.js',
	'L-skeleton.js',
	'L-polygon.js'
    ];

    for (var filename = 0; filename < fileNames.length; filename++)
    {
	fileNames[filename] = tempPath + fileNames[filename];
    }

    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	concat: {
	    options:
	    {
		separator: ";" + grunt.util.linefeed,
		banner: "(function(globalScope){",
		footer: ";globalScope['L'] = L;})(window);"
	    },
	    dist: {
		src: fileNames,
		//src: [tempPath + '**/*.js'],
		dest: outPath + 'Ludix.js'
	    }
	},
	replace: {
	    varDecs: {
		src: [sourcePath + '**/*.js'],
		dest: tempPath,
		replacements: [
		    {
			from: 'var L;',
			to: ''
		    }
		]
	    }
	},
	uglify: {
	    minifying: {
		files: {
		    'eru-game-engine/build/Ludix/Ludix.min.js': [outPath + 'Ludix.js']
		}
	    },
	    options: {
		//compress: {
		//    dead_code: true
		//}
	    }
	},
	copy: {
	    main: {
		files: [
		    {
			expand: true,
			src: ['Gruntfile.js'],
			dest: gruntOutPath,

			rename: function(dest, src) {
			    return dest + src.replace('.js', '.copy.js');
			}
		    },
		    {
			expand: true,
			src: ['package.json'],
			dest: gruntOutPath,
			rename: function(dest, src) {
			    return dest + src.replace('.json', '.copy.json');
			}
		    }
		]
	    }
	},
	clean: ['tempGrunt']



    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build', 'Concat and minify', ['replace', 'concat', 'uglify', 'clean', 'copy']);
};
