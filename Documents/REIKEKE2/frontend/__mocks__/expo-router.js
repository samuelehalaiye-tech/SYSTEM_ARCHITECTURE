const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  navigate: jest.fn(),
}));

const useLocalSearchParams = jest.fn(() => ({}));
const useSegments = jest.fn(() => []);
const router = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };

const Link = ({ children }) => children;

module.exports = { useRouter, useLocalSearchParams, useSegments, router, Link };
