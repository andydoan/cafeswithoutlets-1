import createBrowserHistory from 'history/createBrowserHistory'
const customHistory = createBrowserHistory()

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

(function(){
  require('./global_libraries.js');

  const appContainer = $("#appContent")[0];
  const App = require('jsx/views/application.jsx');

  ReactDOM.render(
    <Router history={customHistory}>
      <div>
        <App />
      </div>
    </Router>,
    appContainer
  );
})();