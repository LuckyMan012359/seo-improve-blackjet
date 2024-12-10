import { renderWithProviders } from 'components/onboarding/__test__/EmilToPhone.test';
import PhoneOnboarding from '../PhoneOnboarding';
import { createMatchMedia } from 'components/enquiryform/__test__/EnquiryForm.test';

describe('PhoneOnboarding', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(window.innerWidth);
  });
  const renderComponent = (contextValues = {}) => {
    renderWithProviders(<PhoneOnboarding />);
  };

  it('renders correctly', () => {
    renderComponent(); 
    // expect(screen.getByText('Phone Recognized')).toBeInTheDocument();
  });
});
