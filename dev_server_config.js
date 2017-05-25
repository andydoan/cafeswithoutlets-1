process.traceDeprecation = true;

module.exports = {
  port: 9008, //Port to use to access origin via the browser for webpack-dev-server (this port does not have to be 9000, but whatever you choose should not be in use by anything else - if it is, the process may be stopped!)
  jsPath: 'build/js', //Location of the final webpack build; must be relative to the src folder your server is using as its base host path
  origin: 'http://localhost', //The origin url for the application
}

//Hit localhost:9008/index.html to develop locally using the webpack-dev-server and make use of hot module reloading