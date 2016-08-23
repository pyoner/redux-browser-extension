var path = require('path');
var gulp = require('gulp');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var gulpSequence = require('gulp-sequence');
var del = require('del');
var config = require('./config');


var BUILD_DIR = './build';
var BUILD_SRC_DIR = path.join(BUILD_DIR, 'src');
var BUILD_ASSETS_DIR = path.join(BUILD_DIR, 'assets');

function rollit(src, dest) {
    var opts = Object.assign({}, { entry: src }, config);
    var filename = path.basename(src);
    return rollup(opts)
        .pipe(source(filename))
        .pipe(gulp.dest(dest));
}

gulp.task('clean', function() {
    return del(BUILD_DIR);
});

gulp.task('copy-assets', function() {
    return gulp.src('./assets/**')
        .pipe(gulp.dest(BUILD_ASSETS_DIR))
});

gulp.task('copy-manifest', function() {
    return gulp.src('manifest.json')
        .pipe(gulp.dest(BUILD_DIR));
})

gulp.task('rollup', function() {
    var entries = [
        './src/background.js',
        './src/content.js',
    ];

    var promises = entries.map(function(entry) {
        return new Promise(function(resolve, reject) {
            var stream = rollit(entry, BUILD_SRC_DIR);
            stream.on('end', resolve);
            stream.on('error', reject);
        })
    })
    return Promise.all(promises);
});

gulp.task('build', gulpSequence('clean', ['copy-manifest', 'copy-assets', 'rollup']));
