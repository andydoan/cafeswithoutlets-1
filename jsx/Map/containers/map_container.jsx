import { connect } from 'react-redux';
import Map from '../components/map.jsx';

import { selectCoffeeShopsData } from 'jsx/redux/selectors/general.js'

const mapStateToProps = (state) => ({
  data: selectCoffeeShopsData(state)
});

const mapDispatchToProps = (dispatch) => ({
});

const MapContainer = (props) => (
  <div id="mapContainer">
    <Map {...props}/>
  </div>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);