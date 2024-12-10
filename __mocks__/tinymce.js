// __mocks__/tinymce.js
module.exports = {
    init: jest.fn(),
    activeEditor: {
      setContent: jest.fn(),
      getContent: jest.fn(() => "<p>Mock content</p>"),
    },
  };
  