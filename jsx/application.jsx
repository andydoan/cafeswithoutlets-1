import { Provider } from 'react-redux';
import createAppReduxStore from './store.js';

import { connect } from 'react-redux';
import ApplicationLayout from './applicationLayout.jsx';

import { getCoffeeShops } from './redux/reducers/general.js';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  getInitialCoffeeShops: () => { dispatch(getCoffeeShops) }
});

const ApplicationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationLayout);

const Application = () => (
  <Provider store={createAppReduxStore()}>
    <ApplicationContainer />
  </Provider>
)

module.exports = Application;
