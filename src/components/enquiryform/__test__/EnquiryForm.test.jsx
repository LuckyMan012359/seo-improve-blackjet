import { render } from '@testing-library/react';
import EnquiryForm from '../EnquiryForm';
import { BrowserRouter } from 'react-router-dom';
import mediaQuery from 'css-mediaquery';
// Mock TinyMCE and CustomEditor
jest.mock('tinymce/tinymce');
jest.mock('../../custom-editor/CustomEditor.jsx', () => () => <div>Mock Editor</div>);
export function createMatchMedia(width) {
  return (query) => ({
    matches: mediaQuery.match(query, {
      width,
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
  });
}

describe('EnquiryForm Test', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(window.innerWidth);
  });
  // Set up matchMedia mock before running test

  // Helper function to render EnquiryForm
  const renderEnquiryForm = () => {
    return render(
      <BrowserRouter>
        <EnquiryForm>
          <div>Test children</div>
        </EnquiryForm>
      </BrowserRouter>,
    );
  };

  it('should render EnquiryForm', () => {
    renderEnquiryForm();
  });
});
