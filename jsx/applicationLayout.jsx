import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import MapLayout from './Map/index.jsx';
import SidebarLayout from './Sidebar/index.jsx';
import AppLoading from './components/app_loading.jsx';

class ApplicationLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locationPrompting: true,
      loadingInitialData: false
    };
  }

  getUserGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ locationPrompting: false });
      }, () => {
        this.setState({ locationPrompting: false });
      });
    } else {
      this.setState({ locationPrompting: false });
    }
  }

  getInitialCoffeeShops() {
    this.props.getInitialCoffeeShops();
  }

  componentDidMount() {
    this.getUserGeolocation();
    this.getInitialCoffeeShops();
  }

  renderApplication() {
    const App = (
      <div>
        <SidebarLayout
        />
        <MapLayout
        />
      </div>
    )

    if(this.state.locationPrompting || this.state.loadingInitialData) {
      return AppLoading;
    } else {
      return App;
    }
  }

  render() {
    return (
      <div>
        {this.renderApplication()}
      </div>
    )
  }
};

module.exports = ApplicationLayout;
