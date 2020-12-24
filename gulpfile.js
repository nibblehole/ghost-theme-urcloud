const {series, watch, src, dest, parallel} = require('gulp');
const pump = require('pump');

// gulp plugins and utils
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var zip = require('gulp-zip');
var beeper = require('beeper');

// postcss plugins
var autoprefixer = require('autoprefixer');
var tailwindcss =   require('tailwindcss');

function serve(done) {
    livereload.listen();
    done();
}

const handleError = (done) => {
    return function (err) {
        if (err) {
            beeper();
        }
        return done(err);
    };
};

function hbs(done) {
    pump([
        src(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs']),
        livereload()
    ], handleError(done));
}

function css(done) {
    var processors = [
        autoprefixer(),
    ];

    pump([
        src('assets/css/*.css', {sourcemaps: true}),
        postcss(processors),
        dest('assets/build/', {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}



function compileTailwindcss(done){
  var processors = [
        tailwindcss(),
        autoprefixer(),
    ];
    pump([
        src('assets/css/tailwindcss.css', {sourcemaps: true}),
        postcss(processors),
        dest('assets/build/', {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}



function zipper(done) {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';
    pump([
        src([
            '**',
            '!node_modules', '!node_modules/**',
            '!dist', '!dist/**'
        ]),
        zip(filename),
        dest(targetDir)
    ], handleError(done));
}

const tailwindcssWatcher = () => watch('assets/css/tailwindcss.css',compileTailwindcss);
const cssWatcher = () => watch(['assets/css/**/*.css', '!assets/css/tailwindcss.css'],css);
const hbsWatcher = () => watch(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs'], hbs);
const watcher = parallel(tailwindcssWatcher,cssWatcher, hbsWatcher);
const build = series(compileTailwindcss,css);
const dev = series(build, serve, watcher);

exports.build = build;
exports.zip = series(build, zipper);
exports.default = dev;
