var gulp, uglify, concat, watch, ts, es, vendor, cssmin, autoprefixer, webserver, defaultTaskList, cssApp, cssCore, FOR_RELEASE;

FOR_RELEASE = (process.argv.indexOf('release') > 0);
vendor = require('./vendor.json');
gulp = require('gulp');
uglify = require('gulp-uglify');
concat = require('gulp-concat');
order = require('gulp-order');
watch = require('gulp-watch');
ts = require('gulp-typescript');
es = require('event-stream');
cssmin = require('gulp-cssmin');
autoprefixer = require('gulp-autoprefixer');
webserver = require('gulp-webserver');

gulp.task('js_core', function () {
    var coreJSFiles = gulp.src(['src/core/**/*.js', 'src/core/*.js']).pipe(concat('core.js')),
        miscJSFiles = gulp.src(['src/plugins/**/index.js', 'src/helpers/*.js']).pipe(concat('misc.js')),
        coreTSFiles = gulp.src(['src/core/**/*.ts', 'src/core/*.ts']).pipe(ts({module: 'amd'})).pipe(concat('core.compiled.js')),
        miscTSFiles = gulp.src(['src/plugins/**/index.ts', 'src/helpers/*.ts']).pipe(ts({module: 'amd'})).pipe(concat('misc.compiled.js')),

        join = es.merge(
            coreJSFiles,
            miscJSFiles,
            coreTSFiles,
            miscTSFiles
        ).pipe(order([
            'core.compiled.js',
            'core.js',
            'misc.compiled.js',
            'misc.js',
        ])).pipe(concat('caviar.min.js'));

    if (FOR_RELEASE) {
        join = join.pipe(uglify());
    }

    return join.pipe(gulp.dest('app/assets/dist/scripts'));
});

gulp.task('js_app', function () {
    var jsfiles = gulp.src(['app/models/*.js', 'app/controllers/*.js', 'app/plugins/**/index.js', 'app/helpers/*.js', '.caviar']),
        tsfiles = gulp.src(['app/models/*.ts', 'app/controllers/*.ts', 'app/plugins/**/index.ts', 'app/helpers/*.ts']),
        compiled = tsfiles.pipe(ts({module: 'amd'})),
        join = es.merge(compiled.js, jsfiles).pipe(concat('app.min.js'));

    if (FOR_RELEASE) {
        join = join.pipe(uglify());
    }

    return join.pipe(gulp.dest('app/assets/dist/scripts'));
});

gulp.task('js_vendor', function () {
    var jsfiles = gulp.src(vendor.js).pipe(concat('vendor.min.js'));

    if (FOR_RELEASE) {
        jsfiles = jsfiles.pipe(uglify());
    }

    return jsfiles.pipe(gulp.dest('app/assets/dist/scripts'));
});

cssCore = ['app/assets/styles/caviar.css', 'app/assets/styles/caviar-*.css', 'src/plugins/**/styles.css'];
gulp.task('css_core', function () {
    var cssfiles = gulp
            .src(cssCore)
            .pipe(concat('caviar.min.css'))
            .pipe(autoprefixer({
                browsers: ['and_chr > 30', 'ios_saf > 6'],
                cascade: false
            }));

    if (FOR_RELEASE) {
        cssfiles = cssfiles.pipe(cssmin());
    }

    return cssfiles.pipe(gulp.dest('app/assets/dist/styles'));
});

cssApp = ['app/assets/styles/app.css', 'app/assets/styles/app-*.css', 'app/plugins/**/styles.css'];
gulp.task('css_app', function () {
    var cssfiles = gulp
            .src(cssApp)
            .pipe(concat('app.min.css'))
            .pipe(autoprefixer({
                browsers: ['and_chr > 30', 'ios_saf > 6'],
                cascade: false
            }));

    if (FOR_RELEASE) {
        cssfiles = cssfiles.pipe(cssmin());
    }

    return cssfiles.pipe(gulp.dest('app/assets/dist/styles'));
});

gulp.task('css_vendor', function () {
    var cssfiles = gulp.src(vendor.css).pipe(concat('vendor.min.css'));

    if (FOR_RELEASE) {
        cssfiles = cssfiles.pipe(cssmin());
    }

    return cssfiles.pipe(gulp.dest('app/assets/dist/styles'));
});

gulp.task('webserver', function () {
    gulp.src('app').pipe(webserver({
        open: 'http://localhost:3000',
        port: 3000
    }));
});

gulp.task('watch', function () {
    gulp.watch([
        'src/core/**/*.js',
        'src/core/*.js',
        'src/plugins/**/index.js',
        'src/core/**/*.ts',
        'src/core/*.ts',
        'src/plugins/**/index.ts',
        'src/helpers/*.ts',
        'src/helpers/*.js'
    ], ['js_core']);

    gulp.watch([
        'app/models/*.js',
        'app/controllers/*.js',
        'app/plugins/**/index.js',
        'app/models/*.ts',
        'app/controllers/*.ts',
        'app/plugins/**/index.ts',
        'app/helpers/*.ts',
        'app/helpers/*.js',
        '.caviar'
    ], ['js_app']);

    gulp.watch(vendor.js, ['js_vendor']);
    gulp.watch(vendor.js, ['css_vendor']);
    gulp.watch(cssApp, ['css_app']);
    gulp.watch(cssCore, ['css_core']);
});


defaultTaskList = [
    'js_core', 'js_app', 'js_vendor', 'css_core', 'css_app', 'css_vendor'
].concat(
    FOR_RELEASE ? [] : ['watch', 'webserver']
);

gulp.task('release', defaultTaskList, function () {
    gulp.src(['app/index.*']).pipe(gulp.dest('.cordova/www'));
    gulp.src(['app/assets/**/*']).pipe(gulp.dest('.cordova/www/assets'));
});

gulp.task('default', defaultTaskList);
