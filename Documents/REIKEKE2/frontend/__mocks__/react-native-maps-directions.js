const React = require('react');

// Simulates MapViewDirections: renders nothing but fires onReady with fake data
const MapViewDirections = ({ onReady, onError, origin, destination }) => {
  React.useEffect(() => {
    if (onReady && origin && destination) {
      onReady({
        distance: 2.4,
        duration: 8,
        coordinates: [origin, destination],
      });
    }
  }, []);
  return null;
};

module.exports = MapViewDirections;
module.exports.default = MapViewDirections;
