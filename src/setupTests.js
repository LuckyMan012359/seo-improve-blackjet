// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
const windowMock = {
  scrollTo: jest.fn(),
};

global.matchMedia = global.matchMedia || function() {
  return {
      matches : false,
      addListener : function() {},
      removeListener: function() {}
  }
}
Object.assign(global, global, windowMock);
