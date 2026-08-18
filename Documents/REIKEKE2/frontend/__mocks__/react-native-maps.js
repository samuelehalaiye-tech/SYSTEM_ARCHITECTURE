const React = require('react');

// AnimatedRegion mock that records timing calls
class AnimatedRegion {
  constructor(coords) {
    this.latitude = coords.latitude;
    this.longitude = coords.longitude;
    this.latitudeDelta = coords.latitudeDelta || 0;
    this.longitudeDelta = coords.longitudeDelta || 0;
  }
  timing(config) {
    // Store last animated coords so tests can assert on them
    this.latitude = config.latitude;
    this.longitude = config.longitude;
    return { start: jest.fn() };
  }
}

const MapView = React.forwardRef(function MapView({ children, onMapReady, ...props }, ref) {
  // Expose imperative methods via ref
  React.useImperativeHandle(ref, () => ({
    animateCamera: jest.fn(),
    fitToCoordinates: jest.fn(),
    animateToRegion: jest.fn(),
  }));
  if (onMapReady) setTimeout(onMapReady, 0);
  return React.createElement('MapView', props, children);
});

MapView.AnimatedRegion = AnimatedRegion;

const Marker = React.forwardRef(function Marker({ children, ...props }, ref) {
  React.useImperativeHandle(ref, () => ({
    animateMarkerToCoordinate: jest.fn(),
  }));
  return React.createElement('Marker', props, children);
});

Marker.Animated = React.forwardRef(function AnimatedMarker({ children, ...props }, ref) {
  React.useImperativeHandle(ref, () => ({
    animateMarkerToCoordinate: jest.fn(),
  }));
  return React.createElement('AnimatedMarker', props, children);
});

const Polyline = (props) => React.createElement('Polyline', props);
const PROVIDER_GOOGLE = 'google';

module.exports = {
  __esModule: true,
  default: MapView,
  MapView,
  Marker,
  Polyline,
  AnimatedRegion,
  PROVIDER_GOOGLE,
};
