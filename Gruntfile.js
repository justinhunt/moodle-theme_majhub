/**
 * Gruntfile for compiling theme_shoehorn .less files.
 *
 * This file configures tasks to be run by Grunt
 * http://gruntjs.com/ for the current theme.
 *
 *
 * Requirements:
 * -------------
 * nodejs, npm, grunt-cli.
 *
 * Installation:
 * -------------
 * node and npm: instructions at http://nodejs.org/
 *
 * grunt-cli: `[sudo] npm install -g grunt-cli`
 *
 * node dependencies: run `npm install` in the root directory.
 *
 * To help you, I have created two screen casts, one 'Production' and one 'Development'.
 * The latter follows the former, so watch 'Production' first.
 * Production:  https://www.youtube.com/watch?v=8uwYn2im008
 * Development: https://www.youtube.com/watch?v=6yFAS5-a3o4
 *
 * Usage:
 * ------
 * Call tasks from the theme root directory. Default behaviour
 * (calling only `grunt`) is to run the watch task detailed below.
 *
 *
 * Porcelain tasks:
 * ----------------
 * The nice user interface intended for everyday use. Provide a
 * high level of automation and convenience for specific use-cases.
 *
 * grunt watch   Watch the less directory (and all subdirectories)
 *               for changes to *.less files then on detection
 *               run 'grunt compile'
 *
 *               Options:
 *
 *               --dirroot=<path>  Optional. Explicitly define the
 *                                 path to your Moodle root directory
 *                                 when your theme is not in the
 *                                 standard location.
 * grunt compile Run the .less files through the compiler, create the
 *               RTL version of the output, then run decache so that
 *               the results can be seen on the next page load.
 *
 *               Options:
 *
 *               --dirroot=<path>  Optional. Explicitly define the
 *                                 path to your Moodle root directory
 *                                 when your theme is not in the
 *                                 standard location.
 *
 *               --urlprefix=<path> Optional. Explicitly define
 *                                  the path between the domain
 *                                  and the installation in the
 *                                  URL, i.e. /moodle27 being:
 *                                  --urlprefix=/moodle27
 *
 * grunt amd     Create the Asynchronous Module Definition JavaScript files.  See: MDL-49046.
 *               Done here as core Gruntfile.js currently *nix only.
 *
 * grunt svg                 Change the colour of the SVGs in pix_core by
 *                           text replacing #999999 with a new hex color.
 *                           Note this requires the SVGs to be #999999 to
 *                           start with or the replace will do nothing
 *                           so should usually be preceded by copying
 *                           a fresh set of the original SVGs.
 *
 *                           Options:
 *
 *                           --svgcolor=<hexcolor> Hex color to use for SVGs
 *
 * Plumbing tasks & targets:
 * -------------------------
 * Lower level tasks encapsulating a specific piece of functionality
 * but usually only useful when called in combination with another.
 *
 * grunt less         Compile all less files.
 *
 * grunt less:moodle  Compile Moodle less files only.
 *
 * grunt less:editor  Compile editor less files only.
 *
 * grunt decache      Clears the Moodle theme cache.
 *
 * grunt compile Run the .less files through the compiler, create the
 *               RTL version of the output, then run decache so that
 *               the results can be seen on the next page load.
 *
 *               Options:
 *
 *               --dirroot=<path>  Optional. Explicitly define
 *                                 the path to your Moodle root
 *                                 directory when your theme is
 *                                 not in the standard location.
 *
 *               --build=<type>    Optional. 'p'(default) or 'd'. If 'p'
 *                                 then 'production' CSS files.  If 'd'
 *                                 then 'development' CSS files unminified
 *                                 and with source map to less files.
 *
 *               --urlprefix=<path> Optional. Explicitly define
 *                                  the path between the domain
 *                                  and the installation in the
 *                                  URL, i.e. /moodle27 being:
 *                                  --urlprefix=/moodle27
 *
 *
 * grunt replace             Run all text replace tasks.
 *
 * grunt replace:rtl_images  Add _rtl to the filenames of certain images
 *                           that require flipping for use with RTL
 *                           languages.
 *
 * grunt replace:font_fix    Correct the format for the Moodle font
 *                           loader to pick up the Glyphicon font.
 *
 * grunt cssflip    Create moodle-rtl.css by flipping the direction styles
 *                  in moodle.css.
 *
 *
 * @package theme
 * @subpackage shoehorn
 * @author G J Barnard - gjbarnard at gmail dot com and {@link http://moodle.org/user/profile.php?id=442195}
 * @author Based on code originally written by Joby Harding, Bas Brands, David Scotson and many other contributors.
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

module.exports = function(grunt) { // jshint ignore:line

    // Import modules.
    var path = require('path');

    // Theme Bootstrap constants.
    var MOODLEURLPREFIX = grunt.option('urlprefix') || '',
        THEMEDIR        = path.basename(path.resolve('.'));

    // PHP strings for exec task.
    var moodleroot = path.dirname(path.dirname(__dirname)), // jshint ignore:line
        configfile = '',
        decachephp = '',
        dirrootopt = grunt.option('dirroot') || process.env.MOODLE_DIR || ''; // jshint ignore:line

    // Allow user to explicitly define Moodle root dir.
    if ('' !== dirrootopt) {
        moodleroot = path.resolve(dirrootopt);
    }

    // Production / development.
    var build = grunt.option('build') || 'd'; // Default of development for watch task.

    if ((build != 'p') && (build != 'd')) {
        build = 'p';
        console.log('-build switch only accepts \'p\' for production or \'d\' for development,');
        console.log('e.g. -build=p or -build=d.  Defaulting to production.');
    }

    var COMPRESS = true;
    var SOURCEMAP = false;
    if (build == 'd') {
        COMPRESS = false;
        SOURCEMAP = true;
        console.log('Creating development version.');
        console.log('Theme directory is: ' + THEMEDIR);
        console.log('URL prefix is     : ' + MOODLEURLPREFIX);
    } else {
        console.log('Creating production version.');
    }

    var PWD = process.cwd(); // jshint ignore:line
    configfile = path.join(moodleroot, 'config.php');

    decachephp += 'define(\'CLI_SCRIPT\', true);';
    decachephp += 'require(\'' + configfile + '\');';
    decachephp += 'theme_reset_all_caches();';

    var svgcolour = grunt.option('svgcolour') || '#1F4D87';

    grunt.initConfig({
        less: {
            // Compile moodle styles for development.
            moodle: {
                options: {
                    compress: COMPRESS,
                    paths: ".",
                    report: 'min',
                    sourceMap: SOURCEMAP,
                    sourceMapRootpath: MOODLEURLPREFIX + '/theme/' + THEMEDIR,
                    sourceMapURL: MOODLEURLPREFIX + '/theme/' + THEMEDIR + '/style/moodle.treasure.map',
                    sourceMapFilename: 'style/moodle.treasure.map'
                },
                src: 'less/moodleallmajhub.less',
                dest: 'style/moodle.css'
            }
        },
        csscomb: {
            options: {
                config: './bootstrap3/.csscomb.json'
            },
            theme: {
                expand: true,
                cwd: 'style/',
                src: ['moodle.css', 'moodle-rtl.css', 'editor.css', 'font-awesome.css'],
                dest: 'style/'
            }
        },
        exec: {
            decache: {
                cmd: 'php -r "' + decachephp + '"',
                callback: function(error) {
                    // exec will output error messages
                    // just add one to confirm success.
                    if (!error) {
                        grunt.log.writeln("Moodle theme cache reset.");
                    }
                }
            }
        },
        watch: {
            // Watch for any changes to less files and compile.
            files: ["less/**/*.less", "../bootstrap/less/**/*.less"],
            tasks: ["compile"],
            options: {
                spawn: false
            }
        },
        cssflip: {
            rtl: {
                src:  'style/moodle.css',
                dest: 'style/moodle-rtl.css'
            },
            rtl_e: {
                src:  'style/experimental/moodle.css',
                dest: 'style/experimental/moodle-rtl.css'
            }
        },
        copy: {
            svg_core: {
                 expand: true,
                 cwd:  'pix_core_originals/',
                 src:  '**',
                 dest: 'pix_core/',
            },
            svg_plugins: {
                 expand: true,
                 cwd:  'pix_plugins_originals/',
                 src:  '**',
                 dest: 'pix_plugins/',
            }
        },
        replace: {
            rtl_images: {
                src: 'style/moodle-rtl.css',
                    overwrite: true,
                    replacements: [{
                        from: '[[pix:theme|fp/path_folder]]',
                        to:   '[[pix:theme|fp/path_folder_rtl]]'
                    }, {
                        from: '[[pix:t/collapsed]]',
                        to:   '[[pix:t/collapsed_rtl]]'
                    }, {
                        from: '[[pix:t/collapsed_empty]]',
                        to:   '[[pix:t/collapsed_empty_rtl]]'
                    }, {
                        from: '[[pix:y/tn]]',
                        to:   '[[pix:y/tn_rtl]]'
                    }, {
                        from: '[[pix:y/tp]]',
                        to:   '[[pix:y/tp_rtl]]'
                    }, {
                        from: '[[pix:y/ln]]',
                        to:   '[[pix:y/ln_rtl]]'
                    }, {
                        from: '[[pix:y/lp]]',
                        to:   '[[pix:y/lp_rtl]]'
                    }]
            },
            svg_colours_core: {
                src: 'pix_core/**/*.svg',
                    overwrite: true,
                    replacements: [{
                        from: '#999999',
                        to: svgcolour
                    }]
            },
            svg_colours_plugins: {
                src: 'pix_plugins/**/*.svg',
                    overwrite: true,
                    replacements: [{
                        from: '#999999',
                        to: svgcolour
                    }]
            },
            font_fix: {
                src: 'style/moodle.css',
                    overwrite: true,
                    replacements: [{
                        from: "glyphicons-halflings-regular.eot",
                        to:   "glyphicons-halflings-regular.eot]]",
                    }, {
                        from: "glyphicons-halflings-regular.svg",
                        to:   "glyphicons-halflings-regular.svg]]",
                    }, {
                        from: "glyphicons-halflings-regular.ttf",
                        to:   "glyphicons-halflings-regular.ttf]]",
                    }, {
                        from: "glyphicons-halflings-regular.woff2'",
                        to:   "glyphicons-halflings-regular.woff2]]'",
                    }, {
                        from: "glyphicons-halflings-regular.woff'",
                        to:   "glyphicons-halflings-regular.woff]]'",
                    }]
            }
        },
        svgmin: {                       // Task
            options: {                  // Configuration that will be passed directly to SVGO
                plugins: [{
                    removeViewBox: false
                }, {
                    removeUselessStrokeAndFill: false
                }, {
                    convertPathData: {
                        straightCurves: false // advanced SVGO plugin option
                   }
                }]
            },
            dist: {                       // Target
                files: [{                 // Dictionary of files
                    expand: true,         // Enable dynamic expansion.
                    cwd: 'pix_core',      // Source matches are relative to this path.
                    src: ['**/*.svg'],    // Actual pattern(s) to match.
                    dest: 'pix_core/',    // Destination path prefix.
                    ext: '.svg'           // Destination file paths will have this extension.
                }, {                      // Dictionary of files
                    expand: true,         // Enable dynamic expansion.
                    cwd: 'pix_plugins',   // Source matches are relative to this path.
                    src: ['**/*.svg'],    // Actual pattern(s) to match.
                    dest: 'pix_plugins/', // Destination path prefix.
                    ext: '.svg'           // Destination file paths will have this extension.
                }]
            }
        },
        jshint: {
            options: {jshintrc: moodleroot + '/.jshintrc'},
            files: ['**/amd/src/*.js']
        },
        uglify: {
            dynamic_mappings: {
                files: grunt.file.expandMapping(
                    ['**/src/*.js', '!**/node_modules/**'],
                    '',
                    {
                        cwd: PWD,
                        rename: function(destBase, destPath) {
                            destPath = destPath.replace('src', 'build');
                            destPath = destPath.replace('.js', '.min.js');
                            destPath = path.resolve(PWD, destPath);
                            return destPath;
                        }
                    }
                )
            }
        }
    });

    require('time-grunt')(grunt);

    // Load contrib tasks.
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-text-replace");
    grunt.loadNpmTasks("grunt-css-flip");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-svgmin');

    // Load core tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Register tasks.
    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("decache", ["exec:decache"]);

    grunt.registerTask("main", [
        "less:moodle",
        "less:editor",
        "less:fontawesome",
        "replace:font_fix",
        "cssflip:rtl",
        "replace:rtl_images",
        "csscomb:theme"]);
    grunt.registerTask("compile", ["main", "decache"]);
    grunt.registerTask("copy:svg", ["copy:svg_core", "copy:svg_plugins"]);
    grunt.registerTask("replace:svg_colours", ["replace:svg_colours_core", "replace:svg_colours_plugins"]);
    grunt.registerTask("svg", ["copy:svg", "replace:svg_colours", "svgmin"]);
    grunt.registerTask("amd", ["jshint", "uglify", "decache"]);
};
