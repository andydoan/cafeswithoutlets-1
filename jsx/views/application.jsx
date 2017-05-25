import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

const Application = () => (
  <div>
    <Switch>
      <Route exact path="/" component={() => (<div><h1>Simple React App</h1><div>Look At Meee</div></div>)}/>
      <Route component={() => <div>RIP Dude - 404</div>}/>
    </Switch>
  </div>
);

module.exports = Application;
