const gulp = require('gulp');
const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();

gulp.task('dev', function() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "app"
    }
  });

  watch('./app/index.html', function() {
    browserSync.reload();
  });

  watch('./app/assets/scripts/**/*.js', function() {
    browserSync.reload();
  });

  watch('./app/assets/styles/**/*.css', function() {
    gulp.start('injectCSS');
  });
});

gulp.task('injectCSS', ['compile-styles'], function() {
  return gulp.src('./app/master/styles/styles.css')
         .pipe(browserSync.stream());
});
