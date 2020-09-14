var gulp = require('gulp');
var watch = require('gulp-watch');
// 压缩html
// gulp中插件的应用 下载插件 --> 取到插件 --> 应用插件
var htmlClean = require('gulp-htmlclean');

// 压缩图片
var imageMin = require("gulp-imagemin");

// 压缩js插件
var uglify = require("gulp-uglify");

// 去掉js中的调试语句
var debug = require("gulp-strip-debug");

// 将less转换成css
var less = require("gulp-less")

// 压缩css
var cleanCss = require("gulp-clean-css");

// 添加前缀
// gulp-postcss autoprefixer --> 把autoprefixer以参数的形式放入gulp-postcss中
var postCss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// 开启服务器代理
var connect = require('gulp-connect');

// 判断当前环境变量
// 获取环境变量 development production
var devMod = process.env.NODE_ENV == "development";
// 命令行设置当前环境变量 export NODE_ENV=development
console.log(devMod);
// 只需要在这里更在路径
var folder = {
    src: "src/",
    dist: "dist/"
}
// html
gulp.task("html", function () {
    // 先取到html文件夹放到dist
    // 取到src里面html文件夹里面所有的文件
    var page = gulp.src(folder.src + "html/*")
        // watch -->重新刷新
        .pipe(connect.reload())
    //在什么时候对html进行压缩: 在它生成文件之前进行压缩
    // 对html进行压缩 --> 先判断环境 --> 生产环境还是开发环境 --> 开发环境不压缩
    if (!devMod) {
        page.pipe(htmlClean());
    }
    // 生成最终的html文件
    page.pipe(gulp.dest(folder.dist + "html/"));


})

// css
gulp.task("css", function () {
    // 先取到css文件夹放到dist
    // 取到src里面css文件夹里面所有的文件
    var page = gulp.src(folder.src + "css/*")
        // watch -->重新刷新
        .pipe(connect.reload())
        // less --> css
        .pipe(less())
        // 添加前缀
        .pipe(postCss([autoprefixer()]));
    // 压缩css
    if (!devMod) {
        page.pipe(cleanCss());
    }
    page.pipe(gulp.dest(folder.dist + "css/"));
})


// js
gulp.task("js", function () {
    // 先取到js文件夹放到dist

    // 取到src里面js文件夹里面所有的文件
    var page = gulp.src(folder.src + "js/*")
        // watch -->重新刷新
        .pipe(connect.reload())
    // 先判断环境 --> 生产环境还是开发环境 --> 开发环境不压缩   
    if (!devMod) {
        // 压缩js
        page.pipe(uglify())
        // 去掉调试语句
        .pipe(debug());
    }
    page.pipe(gulp.dest(folder.dist + "js/"));
})

// image
gulp.task("image", function () {
    // 先取到image文件夹放到dist

    // 取到src里面image文件夹里面所有的文件
    gulp.src(folder.src + "image/*")
        // 压缩图片
        .pipe(imageMin())
        .pipe(gulp.dest(folder.dist + "image/"))
})

// 开启服务
gulp.task('server', function () {
    connect.server({
        port: '8888',
        // 自动刷新
        livereload: true
    });
})

// 开启监听文件变化 --> 自动刷新
gulp.task('watch', function () {
    watch(folder.src + "html/*", gulp.series('html'));
    watch(folder.src + "css/*", gulp.series('css'));
    watch(folder.src + "js/*", gulp.series('js'));
})

gulp.task('default', gulp.parallel('html', 'css', 'js', 'image', 'server', 'watch'));
// gulp.src()
// gulp.dest()
// gulp.task()
// gulp.watch()