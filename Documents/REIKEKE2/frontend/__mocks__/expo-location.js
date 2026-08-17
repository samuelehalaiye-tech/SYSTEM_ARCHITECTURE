const Accuracy = {
  High: 6,
  Balanced: 4,
  Low: 2,
  Lowest: 1,
  BestForNavigation: 6,
};

const requestForegroundPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });
const requestBackgroundPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });
const watchPositionAsync = jest.fn().mockResolvedValue({ remove: jest.fn() });
const getCurrentPositionAsync = jest.fn().mockResolvedValue({
  coords: { latitude: 9.2035, longitude: 12.4954, heading: 0, speed: 0, accuracy: 5 },
  timestamp: Date.now(),
});
const startLocationUpdatesAsync = jest.fn().mockResolvedValue(undefined);
const stopLocationUpdatesAsync = jest.fn().mockResolvedValue(undefined);

module.exports = {
  Accuracy,
  requestForegroundPermissionsAsync,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
  getCurrentPositionAsync,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
};
