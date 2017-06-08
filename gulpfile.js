var gulp = require('gulp')
var runSequence = require('run-sequence')
var chalk = require('chalk') //Pretty colors
var del = require('del')
var sass = require('gulp-ruby-sass')
var fs = require('graceful-fs')
var webpack = require('webpack')
var webpackProgressBar = require('progress-bar-webpack-plugin')
var webpackStream = require('webpack-stream-fixed')
var webpackDevServer = require('webpack-dev-server')
var gutil = require('gulp-util')

var setLocalEnvironment = function() {
  process.env.NODE_ENV = 'local';
}

var setProductionEnvironment = function() {
  process.env.NODE_ENV = 'production';
}

var getNodeEnvironment = function() {
  return process.env.NODE_ENV;
}

var isLocalEnv = function() {
  return getNodeEnvironment() === 'local';
}

var isProduction = function() {
  return getNodeEnvironment() === 'production';
}

var getServerConfig = function(){
  if(isLocalEnv()){
    try {
      return require('./dev_server_config.js');
    }
    catch(e){
      /* Don't throw error if dev server config doesn't exist since it is optional */
    }
  }
  else {
    return;
  }
}

var getWebpackPlugins = function(serverConfig, progress_bar_message, completed_message, chalk_fn) {
  if (!chalk_fn)
    chalk_fn = chalk.green.bold
  if (!completed_message)
    completed_message = 'Main build completed'

  var plugins = [
    new webpack.LoaderOptionsPlugin({
      debug: !isProduction()
    }),
    new webpack.DefinePlugin({ //Allow the node environment to be set for production vs dev builds
      'process.env': {
        'NODE_ENV': JSON.stringify(getNodeEnvironment())
      }
    }),
    new webpackProgressBar({ //Allow progress of the build to stream updates to console
      width: 50,
      format: progress_bar_message,
      summary: false,
      customSummary(buildTime){
        gutil.log(chalk_fn(completed_message + ' in ' + buildTime + '\n'))
      }
    })
  ]

  if (serverConfig){
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if (isProduction()) { // Conditionally add plugins for Production builds
    plugins.push(new webpack.optimize.UglifyJsPlugin({ //UglifyJS will automatically drop any unreachable code.
      /* Mangle and minimize don't seem to work... */
      // mangle: {
      //   except: ['window', '$', 'module', 'exports', 'require']
      // },
      // minimize: true,
      compress: {
        warnings: false //Supress console output of warnings
      }
    }));
  }
  else { // Conditionally add plugins for Development builds
    //Nothing in here for now.
  }

  return plugins;
}

var getWebpackConfig = function(serverConfig, progress_bar_message){
  var jsPath = serverConfig ? serverConfig.origin + ':' + serverConfig.port + '/' + serverConfig.jsPath : undefined
  var webpackEntries = ['./js/app/main.js']
  var reactPresets = ['es2015', 'react']

  if (serverConfig){
    webpackEntries.push('webpack/hot/only-dev-server')
    webpackEntries.push('webpack-dev-server/client?' + serverConfig.origin + ':' + serverConfig.port)
    reactPresets.push('react-hmre')
  }

  return {
    entry: webpackEntries,
    /* eval-source-map allows us to see the mapped source files in the browser's dev tools for easier debugging */
    /* Note that this is only possible in combination with local environment CSP whitelisting of `unsafe-eval`. Important
     * to test code via deployments with no webpack dev server configs to catch unsafe-eval errors */
    devtool: !!serverConfig && 'eval-source-map',
    module: {
      loaders: [
        { /* Transpile all js in the js/app folder */
          test: /\.js$/,
          include: [
            __dirname + '/js/app/'
          ],
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        },
        { /* Transpile all jsx in the jsx folder */
          test: /\.(jsx|js)$/,
          loader: 'babel-loader',
          include: __dirname + '/jsx/',
          query: {
            presets: reactPresets
          }
        }
      ]
    },
    resolve: {
      alias: {
        jsx: __dirname + '/jsx',
      }
    },
    plugins: getWebpackPlugins(serverConfig, progress_bar_message),
    output: {
      filename: 'webpack_build.js',
      path: __dirname + '/build/js/',
      publicPath: jsPath
    }
  }
}

/* empties the build directory - ensures legacy assets are removed from the distribution */
gulp.task('clean:buildDirectory', function (cb) {
  return del([
    'build/**/*'
  ])
})

gulp.task('styles', function() {
  return sass('assets/scss/main.scss')
    .pipe(gulp.dest('assets/css'))
})

gulp.task('webpack', function(cb){
  var serverConfig = getServerConfig()

  /* If not production, and serverConfig exists, allow the webpack-dev-server to build, host and source-map its own webpack_build.js on localhost:<dev_server_config.port>
   * (will not appear in the local filesystem) to enable hot module loading and building single file changes for any changes to js files */
  if (!isProduction() && serverConfig){
    try {
      exec(deleteFile('build/js/webpack_build.js'), function(){})
      /* The below line is meant to trap the cmd+c command and ensure the webpack-dev-server stops, since it intermittently has issues. Comment out for now unless needed: */
      //exec('bash -c "trap \'exec bash\' SIGINT; node_modules/.bin/webpack-dev-server;"')
    }
    catch(e) {
      /* If the delete function returns an error, that's okay! Probably because it doesn't exist.
       * We want no local file to exist for the webpack_build when running the dev server, since the dev
       * server creates its own that it hosts and source-maps for localhost based on the given filename.
       * Having a local version conflicting with the server's version may cause issues. */
    }

    progressMessage = chalk.cyan.bold('Starting dev-server and bundling dependencies:') + ' ' + chalk.bgMagenta('[:bar]') + ' ' + chalk.magenta.bold(':percent') + ' Running for :elapsed seconds'
    webpackConfig = getWebpackConfig(serverConfig, progressMessage)

    var compiler = webpack(webpackConfig)
    var initialCompile = true

    var devServer = new webpackDevServer(compiler, {
      hot: true,
      historyApiFallback: { // Always serve up index.html for all urls.
        index: 'index.html'
      },
      stats: {
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: true,
        warnings: false,
        publicPath: false
      },
      noInfo: true,
      filename: 'build/js/webpack_build.js',
      publicPath: webpackConfig.output.publicPath

    }).listen(serverConfig.port, function(err){
      if (err) cb(err)
    })

    compiler.plugin('done', stats => {
      if (initialCompile){
        initialCompile = false;
        var hasErrors = stats.compilation.errors && stats.compilation.errors.length;
        var message = "Listening to webpack dev server on " + serverConfig.origin + ":" + serverConfig.port + "\n";

        if (hasErrors) {
          /* Don't use callback to throw error, since that will stop the process.
           * Initial compiles with webpack dev server should go through regardless of success, so that the errors can be fixed without having to re-run from scratch. */
          console.log(stats.compilation.errors[0].message);
          gutil.log(chalk.red("PENDING ERRORS: " + message));
        }
        else {
          gutil.log(chalk.magenta(message));
        }

        cb();
      }
    })
  }
  /* If no serverConfig is found, build the webpack_build file in the local filesystem using webpack-stream */
  else {
    var progressMessage = chalk.cyan.bold('Bundling all your hard work:') + ' ' + chalk.bgMagenta('[:bar]') + ' ' + chalk.magenta.bold(':percent') + ' Running for :elapsed seconds'
    var webpackConfig = getWebpackConfig(null, progressMessage)

    return gulp.src('./js/app/main.js')
      .pipe(webpackStream(webpackConfig))
      .on('error', function(err) {
        cb(err)
        return process.exit(1)
      })
      .pipe(gulp.dest('./build/js/'))
  }
})

gulp.task('watch', function(cb) {
  runSequence('default', cb)
  gulp.watch('assets/scss/**/*.scss', { interval: 500 }, ['styles'])
})

gulp.task('default', function(cb) {
  runSequence('styles', 'webpack', function(err){
    if (err) {
      return process.exit(1)
    } else {
      cb()
    }
  })
})