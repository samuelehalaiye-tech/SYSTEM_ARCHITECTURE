// Minimal stub of react-native for Node/Jest environment
const React = require('react');

const View = ({ children }) => children ?? null;
const Text = ({ children }) => children ?? null;
const Pressable = ({ children, onPress }) => children ?? null;
const ActivityIndicator = () => null;
const Alert = { alert: jest.fn() };
const Platform = { OS: 'android', select: (obj) => obj.android ?? obj.default };
const StyleSheet = {
  create: (styles) => styles,
  absoluteFillObject: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  flatten: (style) => style,
};
const DeviceEventEmitter = {
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  emit: jest.fn(),
};
const Animated = {
  Value: class { constructor(v) { this._value = v; } },
  timing: jest.fn(() => ({ start: jest.fn() })),
  spring: jest.fn(() => ({ start: jest.fn() })),
  View,
};

module.exports = {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  DeviceEventEmitter,
  Animated,
};
