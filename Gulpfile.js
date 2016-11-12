const gulp = require('gulp');
const zip = require('gulp-zip');
const runSequence = require('run-sequence');
const clean = require('gulp-clean');
const mergeStream = require('merge-stream');
const uglify = require('gulp-uglify');

const config = [
	{
		src: "app/app.js",
		dest: "app",
		minify: true
	},
	{
		src: "app/not_app.js",
		dest: "app/not",
		newName: "app.js"
	},
	{
		src: "design/design.js",
		dest: "design"
	}
];

const srcPath = "src/";
const packagePath = "package/";

gulp.task('clean:dist', function(){
	return gulp.src('dist/*', {read: false})
		.pipe(clean());
});

gulp.task('copy', function () {
	var tasks = [];
    for (var fileId in config) {
    	file = config[fileId];

    	var currentTask = gulp.src(srcPath + file.src);

        if (file.minify) {
        	console.log("Minifying: " + file.src);
        	currentTask = currentTask.pipe(uglify());
        }

        currentTask = currentTask.pipe(gulp.dest(packagePath + file.dest));

        tasks.push(currentTask);
    }
    return mergeStream(tasks);
});


gulp.task('zip:package', function() {
    return gulp.src('package/**/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('remove:package', function(){
	return gulp.src('package', {read: false})
		.pipe(clean());
});


gulp.task('default', function(){
	runSequence(
		'copy',
		'clean:dist',
		'zip:package',
		'remove:package'
	)
});