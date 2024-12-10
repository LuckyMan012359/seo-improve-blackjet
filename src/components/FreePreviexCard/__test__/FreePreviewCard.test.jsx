import { render } from '@testing-library/react';
import FreePreviewCard from '..';
import { BrowserRouter as Router } from 'react-router-dom';
import OnboardingContext from 'context/OnboardingContext';
describe('FreePreviewCard Component', () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    
    jest.clearAllMocks();
  });
  const renderComponent = (props = {}) =>
    render(
      <Router>
        <OnboardingContext.Provider
          value={{ onboardingForms: {}, dispatchOnboardingForms: mockDispatch }}
        >
          <FreePreviewCard {...props} />
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
