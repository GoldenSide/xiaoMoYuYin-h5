// // 获取 gulp
// var gulp = require('gulp');
// // 获取 gulp-ruby-sass 模块
// var sass = require('gulp-ruby-sass');
// // 编译sass
// // 在命令行输入 gulp sass 启动此任务
// gulp.task('sass', function () {
//     sass('temp/src/css/**/*.scss')
//         .on('error', function (err) {
//             console.error('Error!', err.message);
//         })
//         .pipe(gulp.dest('temp/disk/css/'))
// });
// // 在命令行使用 gulp auto 启动此任务
// gulp.task('auto', function() {
//     // 监听文件修改，当文件被修改则执行
//     gulp.watch('temp/src/css/**/*.scss', ['sass'])
// });
// // 使用 gulp.task('default') 定义默认任务
// // 在命令行使用 gulp 启动 sass 任务和 auto 任务
// gulp.task('default', ['sass', 'auto']);


/**
 * Created by liuc on 2017/1/9.
 */
'use strict';

/**
 * 1. SASS编译 压缩 合并
 * 2. JS合并 压缩混淆
 * 3. img复制
 * 4. html压缩
 */

// 在gulpfile中先载入gulp包，因为这个包提供了一些API
var gulp = require('gulp');
// var less = require('gulp-less');
var sass = require('gulp-ruby-sass');
var cssnano = require('gulp-cssnano');

//  1. LESS编译 压缩 --合并没有必要，一般预处理CSS都可以导包
gulp.task('style', function () {
    // gulp.src(['src/styles/*.less', '!src/styles/_*.less']) //!表示排除这类文件
    sass(['src/css/*.scss', '!src/css/_*.scss'])
    // .pipe(less())
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));

    sass('src/css/iconfont/*.scss')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css/iconfont/'))
        .pipe(browserSync.reload({
            stream: true
        }));

    gulp.src(['src/css/iconfont/*', '!src/css/iconfont/*.scss'])
        .pipe(gulp.dest('dist/css/iconfont/'));

});

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// 2. JS合并 压缩混淆
gulp.task('script', function () {
    gulp.src('src/js/*.js')
    .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// 3. 图片复制
gulp.task('image', function () {
    gulp.src('src/img/*.*')
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

var htmlmin = require('gulp-htmlmin');

// 4. HTML
gulp.task('html', function () {
    gulp.src('src/*.html')
        .pipe(htmlmin({}))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({
            stream: true
        }));

    gulp.src('src/htm/*.html')
        .pipe(htmlmin({}))
        .pipe(gulp.dest('dist/htm/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


var browserSync = require('browser-sync');

// 5.监听文件变化
gulp.task('serve', function () {
    browserSync({
        server: {
            baseDir: ['dist'],
            routes: {
                '/bower_components': 'bower_components'
            }
        },
    }, function (err, bs) {
        console.log(bs.options.getIn(["urls", "local"]));
    });

    gulp.watch(['src/css/*.scss', 'src/css/iconfont/*'], ['style']);
    gulp.watch('src/js/*.js', ['script']);
    gulp.watch('src/img/*.*', ['image']);
    gulp.watch(['src/*.html', 'src/htm/*.html'], ['html']);
});

// 6.默认任务
gulp.task('default', ['style', 'script', 'image', 'html', 'serve']);


