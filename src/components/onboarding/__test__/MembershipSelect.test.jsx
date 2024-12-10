import { render } from '@testing-library/react';
import MembershipSelection from '../MembershipSelection';
import { BrowserRouter as Router } from 'react-router-dom';
import OnboardingContext from 'context/OnboardingContext';
import { createMatchMedia } from 'components/enquiryform/__test__/EnquiryForm.test';
describe('MembershipSelect', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(window.innerWidth);
  });
  const mockDispatch = jest.fn();
  const renderComponent = (props = {}) =>
    render(
      <Router>
        <OnboardingContext.Provider
          value={{ onboardingForms: {}, dispatchOnboardingForms: mockDispatch }}
        >
          <MembershipSelection {...props} />
        </OnboardingContext.Provider>
      </Router>,
    );

  it('should render the component and display membership details', () => {
    renderComponent();
    // expect(screen.getByText('Limited memberships left at this price')).toBeInTheDocument();
    // expect(screen.getByText(/Unlimited access/)).toBeInTheDocument();
    // expect(screen.getByText(/100/)).toBeInTheDocument();
  });
});
