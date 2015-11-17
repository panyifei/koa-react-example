var gulp = require('gulp');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var less = require('gulp-less');
var path = require('path');
var gutil = require("gulp-util");
var open = require('gulp-open');

var devPort = 3001;
//dev task,react hot-reloader
gulp.task('hot', function (callback) {
    var compiler = webpack({
        devtool: 'eval',
        //devtool: 'cheap-module-eval-source-map',
        entry: [
            'webpack-dev-server/client?http://localhost:' + devPort,
            'webpack/hot/only-dev-server',
            './src/js/index.js'
        ],
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'bundle.js',
            publicPath: '/static/'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ],
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['react-hot', 'babel'],
                    exclude: /node_modules/
                }, {
                    test: /\.less$/,
                    loader: "style-loader!css-loader!less-loader"
                }
            ]
        }
    });

    new WebpackDevServer(compiler, {
        publicPath: '/static/',
        hot: true,
        historyApiFallback: true,
        port: devPort,
        stats: {
            colors: true
        }
    }).listen(devPort, "localhost", function (err) {
            if (err) throw new gutil.PluginError("webpack-dev-server", err);
            gutil.log("[webpack-dev-server]", "http://localhost:3000/webpack-dev-server/dev.html");
        });
});

gulp.task('uri', function () {
    gulp.src(__filename)
        .pipe(open({uri: "http://localhost:" + devPort + "/dev.html"}));
});

gulp.task('build', function (callback) {
    var webpackConfig = {
        entry: [
            './src/js/index.js'
        ],
        output: {
            path: './dist',
            filename: 'bundle.min.js',
            publicPath: '/static/'
            //libraryTarget: "commonjs"
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.UglifyJsPlugin()
        ],
        resolve: {
            extensions: ['', '.js']
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loaders: ['jsx-loader', 'babel'],
                    exclude: /node_modules/
                }, {
                    test: /\.less$/,
                    loader: "style-loader!css-loader!less-loader"
                }
            ]
        },
        externals: {}
    };

    webpack(
        webpackConfig, function (err, stats) {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({
                // output options
            }));
            callback();
        });
});
gulp.task('less',function(){
   return gulp.src('./src/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css/'));
});
gulp.task('css',function(){
    return gulp.src('./src/css/*.css')
        .pipe(gulp.dest('./dist/css/'));
});
gulp.task('watch', function() {
    gulp.watch('./src/less/*.less', ['less']);
    gulp.watch('./src/css/*.css', ['css']);
});

gulp.task('default', ['build','less','css']);
gulp.task('dev', ['hot', 'uri','less','css','watch']);