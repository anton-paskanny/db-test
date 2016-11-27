'use strict';
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    sass = require('gulp-sass'),
    sassLint = require('gulp-sass-lint'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require("gulp.spritesmith"),
    plumber = require('gulp-plumber'),
    notify = require("gulp-notify"),
    browserSync = require('browser-sync').create();

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/'
    },
    src: {
        html: 'src/*.html',
        mainJs: 'src/js/main.js',
        style: 'src/sass/style.sass',
        img: 'src/img/**/*.*',
        pngSprite: 'src/sprite/png/'
    },
    watch: {
        html: 'src/*.html',
        mainJs: 'src/js/**/main.js',
        style: 'src/sass/**/*.*',
        img: 'src/img/**/*.*',
        pngSprite: 'src/sprite/png/*.png'
    },
    clean: './build'
};

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
      .pipe(gulp.dest(path.build.html))
      .pipe(browserSync.stream());
});

gulp.task('mainJs:build', function () {
    gulp.src(path.src.mainJs)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sass({
          errLogToConsole: true,
          includePaths: require('node-normalize-scss').includePaths
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('sassLint', function () {
    return gulp.src('src/sass/**/*.s+(a|c)ss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});

gulp.task('png-sprite', function () {
    var spriteData =
        gulp.src(path.src.pngSprite + '*.png')
            .pipe(spritesmith({
              retinaSrcFilter: path.src.pngSprite + '*@2x.png',
              imgName: 'sprite.png',
              retinaImgName: 'sprite-2x.png',
              cssName: '_png-sprite.sass'
            }));

    spriteData.img.pipe(gulp.dest('src/img/'));
    spriteData.css.pipe(gulp.dest('src/sass/helpers/'));
});

gulp.task('build', [
    'html:build',
    'mainJs:build',
    'style:build',
    'image:build',
    'png-sprite',
]);

gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.mainJs], function (event, cb) {
        gulp.start('mainJs:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.pngSprite], function (event, cb) {
        gulp.start('png-sprite');
    });
});

gulp.task('default', ['build', 'browser-sync', 'watch']);
