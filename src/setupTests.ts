
// Testing setup file
import '@testing-library/jest-dom';

// Setup global mocks here if needed

// Mock for requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
  return 0;
};

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Define missing properties
if (!global.structuredClone) {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}
