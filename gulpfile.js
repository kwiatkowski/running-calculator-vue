var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename')
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    order = require('gulp-order'),
    uglify = require('gulp-uglify');


// paths
var paths = {
    sass: {
        src: 'source/sass',
        dest: 'web/assets/css'
    },
    js: {
        src: 'source/scripts',
        dest: 'web/assets/js'
    }
};


function css() {
    return gulp
        .src(paths.sass.src + '/*.{scss,sass}')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autoprefixer())
        .pipe(rename('style.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.sass.dest));
}

function css_min() {
    return gulp
        .src(paths.sass.dest + '/style.css')
        .pipe(minifycss({compatibility: 'ie8'}))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(paths.sass.dest))
}

function js() {
    return gulp
        .src(paths.js.src + '/**/*.js')
        .pipe(order(['jquery.min.js', '*.js']))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.js.dest));
}

function js_min() {
    return gulp
        .src(paths.js.dest + '/app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest(paths.js.dest))
}


// watch
function watch() {
    gulp.watch(paths.sass.src, gulp.series(css, css_min));
    gulp.watch(paths.js.src, gulp.series(js, js_min));
}


// css
gulp.task("css", css);
gulp.task("cssmin", gulp.series(css, css_min));

// js
gulp.task("js", js);
gulp.task("jsmin", gulp.series(js, js_min));


// watch
gulp.task('watch', gulp.parallel(watch));
