var path = require('path');
var gulp = require('gulp');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var config = require('./config');

function rollit(src, dest) {
    var opts = Object.assign({}, { entry: src }, config);
    var filename = path.basename(src);
    return rollup(opts)
        .pipe(source(filename))
        .pipe(gulp.dest(dest));
}

gulp.task('build', function() {
    var entries = [
        './src/background.js',
        './src/content.js',
    ];
    var dest = './build';

    var promises = entries.map(function(entry) {
        return new Promise(function(resolve, reject) {
            var stream = rollit(entry, dest);
            stream.on('end', resolve);
            stream.on('error', reject);
        })
    })
    return Promise.all(promises);
});
