import gulp from "gulp";
import path from "path";
import rimraf from "rimraf";
import webpack from "webpack";
import child_process from "child_process";

import webpackConfig from "./webpack.config.js";

const $ = require("gulp-load-plugins")();


// ***********************************************
// SERVER

const config = {
  buildFolder: './build/'
};

gulp.task('server:clean', (cb) => {
  rimraf(config.buildFolder, () => cb());
});

gulp.task(
  'server:build',
  gulp.series(
    'server:clean',
    compileServer
  )
);

gulp.task(
  'server:watch',
  gulp.series(
    'server:build',
    watchServer
  )
);

gulp.task(
  'server:dev',
  gulp.series(
    'server:build',
    gulp.parallel(
      watchServer,
      runServer
    )
  )
);

gulp.task(
  'server:test',
  gulp.series(
    'server:build',
    testServer
  )
);

gulp.task(
  'server:test:dev',
  gulp.series(
    'server:build',
    gulp.parallel(
      watchServer,
      runServerTests
    )
  )
);

function compileServer() {
  return gulp.src('./src/server/**/*.js')
    .pipe($.changed(config.buildFolder))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write(
      '.',
      { sourceRoot: path.join(__dirname, 'src', 'server') }
    ))
    .pipe(gulp.dest(config.buildFolder));
}

function watchServer() {
  return gulp
    .watch('./src/server/**/*.js', gulp.series(compileServer))
    .on('error', () => {
    });
}

function runServer() {
  return $.nodemon({
    script: './server.js',
    watch: 'build',
    ignore: ['**/__tests']
  });
}

function testServer(cb) {
  child_process.exec('node ./tests.js', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);

    if (err) {
      cb(new $.util.PluginError('testServer', 'Tests failed!'));
    } else {
      cb();
    }
  });
}

function runServerTests() {
  return $.nodemon({
    script: './tests.js',
    watch: 'build'
  });
}


// ***********************************************
// CLIENT

const consoleStats = {
  colors: true,
  exclude: ['node_modules'],
  chunks: false,
  assets: false,
  timings: false,
  modules: false,
  hash: false,
  version: false
};

gulp.task(
  'client:clean',
  (cb) => {
    rimraf('./public/build/', () => cb());
  }
);

gulp.task(
  'client:build',
  gulp.series(
    'client:clean',
    buildClient
  )
);

gulp.task(
  'client:dev',
  gulp.series(
    'client:clean',
    watchClient
  )
);

function buildClient(cb) {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      cb(err);
      return;
    }

    console.log(stats.toString(consoleStats));
    cb();
  });
}

function watchClient() {
  const WebpackDevServer = require("webpack-dev-server");
  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, {
    publicPath: '/build/',
    hot: true,
    stats: consoleStats
  });

  server.listen(8080, () => {
  });
}


// ***********************************************
// OTHER TASKS

gulp.task(
  'dev',
  gulp.parallel(
    'server:dev',
    'client:dev'
  )
);

gulp.task(
  'build',
  gulp.parallel(
    'server:build',
    'client:build'
  )
);