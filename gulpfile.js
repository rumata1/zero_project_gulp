const gulp = require('gulp'),
	  concat = require('gulp-concat'),
	  sass = require('gulp-sass'),
	  browserSync = require('browser-sync'),
	  autoprefixer = require('gulp-autoprefixer'),
	  del = require('del'),
	  uglify = require('gulp-uglify'),
      cssnano = require('gulp-cssnano'),
      rename = require('gulp-rename'),
      imagemin = require('gulp-imagemin'),
	  pngquant = require('imagemin-pngquant'),
	  cache = require('gulp-cache'),
      cleanCSS = require('gulp-clean-css');

//функции
function clean(){
	 return del(['build/*']);
}

function watch(){
	browserSync({
        server: {
            baseDir: 'src'
        },
		port: 8080,
        notify: false
    });
	
	gulp.watch('./src/*.html').on('change', browserSync.reload);
	gulp.watch('./src/sass/style.sass', gulp.series('sass'));
	gulp.watch(['./src/js/libs/**/*.js','./src/js/plugins/**/*.js'], gulp.series('scripts'));
	
}

function sass_style(){
	return gulp.src('./src/sass/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('./src/css'))
		.pipe(browserSync.stream());
}

function css_style(){
	return gulp.src(['./src/css/*.css','node_modules/normalize.css/normalize.css'])
		.pipe(concat('style.css'))
		.pipe(cleanCSS({level: 2}))
		.pipe(gulp.dest('./src/css'))
		.pipe(browserSync.stream());
}

function js_scripts(){
	return gulp.src(['./src/js/libs/**/*.js','./src/js/plugins/**/*.js'])
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./src/js'))
		.pipe(browserSync.stream());
}

function img_min(){
	return gulp.src('src/img/**/*') 
		.pipe(cache(imagemin({  
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('build/img'));	
}


function build_project(){
	let buildCss = gulp.src([
		'src/css/*.css'
	])
	
	.pipe(gulp.dest('build/css'))

	var buildFonts = gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('build/fonts'))

	var buildJs = gulp.src('src/js/**/*')
	.pipe(gulp.dest('build/js'))

	var buildHtml = gulp.src('src/*.html')
	.pipe(gulp.dest('build'));
}

/*Таски*/

gulp.task('sass', gulp.series(sass_style, css_style));
gulp.task('styles', css_style);
gulp.task('scripts', js_scripts);
gulp.task('clean', clean);
gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('img', img_min);

gulp.task('build', gulp.series('clean', 'styles', 'scripts', 'img', build_project));
gulp.task('watch', watch);

gulp.task('default', gulp.parallel(watch));

