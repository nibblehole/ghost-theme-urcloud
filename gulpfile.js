const {series, watch, src, dest, parallel} = require('gulp');
const pump = require('pump');

// gulp plugins and utils
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var zip = require('gulp-zip');
var beeper = require('beeper');

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

function less(done) {
    var processors = [
        require('autoprefixer')
    ];
    pump([
        src(['assets/less/**/*.less'], {sourcemaps: true}),
        require('gulp-less')({
            paths:['assets/less']
        }),
        postcss(processors),
        dest('assets/build/', {sourcemaps: '.'}),
        livereload()
    ], handleError(done));
}



function tailwindcss(done){
  var processors = [
        require('tailwindcss'),
        require('autoprefixer')
    ];
    pump([
        src('assets/tailwindcss.css'),
        postcss(processors),
        dest('assets/build/'),
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

const tailwindcssWatcher = () => watch('assets/tailwindcss.css',tailwindcss);
const lessWatcher = () => watch('assets/less/**/*.less',less);
const hbsWatcher = () => watch(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs'], hbs);
const watcher = parallel(tailwindcssWatcher,lessWatcher, hbsWatcher);
const build = series(tailwindcss,less);
const dev = series(build, serve, watcher);

exports.build = build;
exports.zip = series(build, zipper);
exports.default = dev;
