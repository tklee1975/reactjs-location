const GOOGLE_MAP_KEY = "AIzaSyDFW1nl-Ov5Mam4khLfxrEr0ikpL2ca2mQ";

// Main React Source
const DISPLAY_TYPE_MAP = 1;
const DISPLAY_TYPE_STREETVIEW = 2;

var MapComponent = React.createClass({
  getDefaultProps: function() {
    return {
        latitude: 0,
        longitude: 0,
        size: 400,
      };
  },

  getInitialState: function() {
    return {
      displayType: DISPLAY_TYPE_MAP,
    }
  },

  displayTypeChanged: function() {
    var newDisplay = this.refs.displayMap.checked ?
                      DISPLAY_TYPE_MAP : DISPLAY_TYPE_STREETVIEW;

    if(newDisplay == this.state.displayType) {
      // nothing to do
      return;
    }

    this.setState(
      {displayType: newDisplay}
    );
  },

  render: function() {

    var size = this.props.size;
    var mapUrl = "http://maps.googleapis.com/maps/api/staticmap?"
            + "size=" + this.props.size + "x" + this.props.size
            + "&markers=" + this.props.latitude + "," + this.props.longitude;

    var streetViewUrl = "http://maps.googleapis.com/maps/api/streetview?"
            + "size=" + this.props.size + "x" + this.props.size
            + "&location=" + this.props.latitude + "," + this.props.longitude
            + "&fov=100&heading=180&pitch=0";

    var locationStr = this.props.latitude + "," + this.props.longitude;

    var displayUrl = this.state.displayType == DISPLAY_TYPE_MAP ?
                        mapUrl : streetViewUrl;

    return (
      <div className="MainPanel ">
        <div className="Content">
          <img className="ContentImage" src={displayUrl} />
          <div className="Info">Location: {locationStr}
          </div>
        </div>
        <div className="MapOption">
          <div className="RadioGroup">
            <input type="radio" ref="displayMap" name="viewType" value="map" defaultChecked onChange={this.displayTypeChanged} />Map
            &nbsp;
            <input type="radio" ref="displayStreet" name="viewType" value="streetview" onChange={this.displayTypeChanged}  />Streetview
          </div>
        </div>
      </div>
    );
  }
});

var LocationInput = React.createClass({
  changeLocation: function(newLat, newLng) {
    this.props.onLocationChange(newLat, newLng);

  },

  useMyLocation : function() {
    console.log("Use my location is clicked");

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.onLocationUpdated);
    } else {
    }
  },

  onLocationUpdated: function(position) {
    var roundLat = Math.round(position.coords.latitude * 100000) / 100000;
    var roundLng = Math.round(position.coords.longitude * 100000) / 100000;

    this.changeLocation(roundLat, roundLng);

    this.refs.locationInput.value = roundLat + "," + roundLng;
  },

  parseLatLng: function(locationStr) {
    var pair = locationStr.split(",");

    var lat = parseFloat(pair[0]);
    var lng = parseFloat(pair[1]);

    return [lat, lng];
  },




  useNewLocation: function(e) {
    console.log("New location: " + input + " e=" + e + " keycode" + e.keyCode);
    if(e.keyCode != 13) {
      return true;
    }

    var input = this.refs.locationInput.value;
    console.log("New location: " + input);
    var latlng = this.parseLatLng(input);

    var newLat = latlng[0];
    var newLng = latlng[1];

    this.changeLocation(newLat, newLng);
  },

  render: function() {
    var locationStr = this.props.latitude + "," + this.props.longitude;
    return (
      <div className="Input">
      <input className="LocationInput center"
            ref="locationInput"
            type="text" placeholder="Your Location"
            onKeyDown={this.useNewLocation}
            defaultValue={locationStr} />
      <button className="LocationButton center" onClick={this.useMyLocation}>Use current location</button>
      </div>
    );
  }
});

var MainApp = React.createClass({
  getInitialState: function() {
    return {
      status: "not-ready",    // values: unknown, ready, error
      lat: 22.266340,
      lng: 114.237563,
    };
  },

  changeLocation: function(newLat, newLng) {
    this.setState(
      {
        lat: newLat,
        lng: newLng,
      }
    );
  },

  setLocationData: function(position) {
    this.setState(
      {
        status: "ready",
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    );
  },

  updateLocation: function() {
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.setLocationData);
      } else {
      }
  },


  componentDidMount: function() {
    //this.updateLocation();
    this.refs.locationInput.useMyLocation();
  },


  render: function() {
    //var display = <TimerDisplay ref="timerDisplay" displayTime="1233" />;
    var myLocation = <MapComponent ref="myLocation"
            latitude={this.state.lat}
            longitude={this.state.lng}
            />

    var locationInput = <LocationInput ref="locationInput"
                  latitude={this.state.lat}
                  longitude={this.state.lng}
                  onLocationChange={this.changeLocation}
                  />

    return (
      <div>
      {myLocation}
      {locationInput}
      </div>
    );
  }
});

// -------------------------
//
// Rendering
//
// -------------------------
ReactDOM.render(<MainApp/>, document.getElementById('MainApp'));
