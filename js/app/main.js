import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

const loadGoogleMapsAPI = require('load-google-maps-api');

const startMain = () => {
  const appContainer = $("#appContent")[0];
  const App = require('jsx/application.jsx');

  ReactDOM.render(
    <Router>
      <Switch>
        <Route exact path="/" component={App}/>
        <Route component={() => <div>RIP Dude - 404</div>}/>
      </Switch>
    </Router>,
    appContainer
  );
}

const initGoogleMaps = () => {
  const mapOptions = {
    key: "AIzaSyDyoMyCU3MVWBgsb8pppa2clUBkKun7JSQ"
  };

  loadGoogleMapsAPI(mapOptions).then((googleMaps) => {
    window.GoogleMaps = googleMaps;
    startMain();
  })
};

(function(){
  require('./global_libraries.js');
  initGoogleMaps();
})();