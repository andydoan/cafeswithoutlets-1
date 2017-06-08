module.exports = (function(){
  /* vendors */
  window.$ = require('jquery');
  window._ = require('lodash');
  window.axios = require('axios');

  /* Start up all React libraries needed at runtime */
  window.React = require('react');
  window.ReactDOM = require('react-dom');
})()