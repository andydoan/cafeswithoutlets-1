import * as MapHelpers from '../helpers/map_helpers.js';
import MapConfigurationOptions from '../configurations/map_configuration_options.js'

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.mapMarkers = [];
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      //do stuff
    }
  }

  componentDidMount() {
    const x = MapConfigurationOptions;
    this.googleMaps = new GoogleMaps.Map(this.mapRef, MapConfigurationOptions)

    this.setState({}); //need to trigger a rerender to plot data markers.
  }

  clearExistingMarkers() {
    if(this.mapMarkers && this.mapMarkers.length) {
      MapHelpers.clearMarkers(this.mapMarkers);
      this.mapMarkers = [];
    }
  }

  render() {
    this.clearExistingMarkers();

    if (this.googleMaps) {
      this.mapMarkers = [
        ...this.mapMarkers,
        ...MapHelpers.createMarkers({
          map: this.googleMaps,
          data: this.props.data
        })
      ]
    }

    return (
      <div>
        {this.props.loading ? MapLoading : null}
        <div
          id="map"
          ref={(ref) => this.mapRef = ref}
        >
        </div>
      </div>
    )
  }
};

export default Map;