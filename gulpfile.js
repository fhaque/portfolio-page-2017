const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

// task to compile sass
gulp.task('styles', function() {
    return gulp .src('./dev/styles/**/*.scss')
                .pipe( sass().on('error', sass.logError) )
                .pipe( concat('style.css') )
                .pipe( gulp.dest('./public/styles/') );
});

//convert JS to es2015
gulp.task('scripts', function() {
    return gulp .src('./dev/scripts/**/*.js')
                .pipe(babel({
                    presets: ['es2015']
                }))
                .pipe( gulp.dest('./public/scripts/') );
});

// move assets to public
gulp.task('assets', () => {
// return gulp.src('./dev/assets/**/*')
//   .pipe(gulp.dest('./public/assets/'))
//   .pipe(reload({stream: true}));

    return gulp.src('./dev/assets/**/*')
        .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
            ]
        })
        ]))
        .pipe(gulp.dest('./public/assets/'))
        .pipe(reload({stream: true}));
});

// Browsersync
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

// task to watch changes
gulp.task('watch', function() {
    gulp.watch('./dev/styles/**/*.scss', ['styles']);
    gulp.watch('./dev/scripts/main.js', ['scripts']);
});

// default task
gulp.task('default', ['browser-sync', 'assets', 'styles', 'scripts', 'watch']);