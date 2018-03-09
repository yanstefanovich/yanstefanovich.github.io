const gulp = require('gulp');
const postcss = require('gulp-postcss');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const importCSS = require('postcss-import');
const mixinCSS = require('postcss-mixins');

gulp.task('compile-styles', function() {
  return gulp.src('./app/assets/styles/styles.css')
        .pipe(postcss([importCSS, mixinCSS, precss, autoprefixer]))
        .on('error', function(error) {
          console.log(error.toString());
          this.emit('end');
        })
        .pipe(gulp.dest('./app/master/styles'));
})
