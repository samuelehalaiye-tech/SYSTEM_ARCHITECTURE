// Minimal stub of react-native for Node/Jest environment
const React = require('react');

const createHostComponent = (name) => ({ children, ...props }) =>
  React.createElement(name, props, children);

// Keep native primitives as host elements so React Native Testing Library can
// find text, inputs, and controls when rendering an actual screen.
const View = createHostComponent('View');
const Text = createHostComponent('Text');
const TextInput = createHostComponent('TextInput');
const Image = createHostComponent('Image');
const Switch = createHostComponent('Switch');
const ScrollView = createHostComponent('ScrollView');
const Modal = createHostComponent('Modal');
const Pressable = createHostComponent('Pressable');
const SafeAreaView = createHostComponent('SafeAreaView');
const ActivityIndicator = createHostComponent('ActivityIndicator');
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
  Value: class {
    constructor(v) { this._value = v; }
    setValue(v) { this._value = v; }
    stopAnimation() {}
  },
  timing: jest.fn(() => ({ start: jest.fn() })),
  spring: jest.fn(() => ({ start: jest.fn() })),
  View,
};
const PanResponder = {
  create: jest.fn((config) => ({
    panHandlers: config,
  })),
};

module.exports = {
  View,
  Text,
  TextInput,
  Image,
  Switch,
  ScrollView,
  Modal,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  DeviceEventEmitter,
  Animated,
  PanResponder,
};
