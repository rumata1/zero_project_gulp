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
      pngquant = require('pngquant'),
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
	gulp.watch('./src/js/**/*.js').on('change', browserSync.reload);
	gulp.watch('./src/sass/style.sass', gulp.series('sass'));
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
	return gulp.src(['./src/js/**/*.js'])
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/js'));
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
	return new Promise((resolve,reject)=>{
		let buildCss = gulp.src(['src/css/*.css'])
		.pipe(gulp.dest('build/css'))

		let buildFonts = gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('build/fonts'))

		let buildJs = gulp.src('src/js/script.js')
		.pipe(gulp.dest('build/js'))

		let buildHtml = gulp.src('src/*.html')
		.pipe(gulp.dest('build'));

		resolve();
	});
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
