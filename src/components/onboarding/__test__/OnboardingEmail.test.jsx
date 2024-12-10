import { render } from '@testing-library/react';
import OnboardingContext from 'context/OnboardingContext';
import { BrowserRouter } from 'react-router-dom';
import OnboardingEmail from '../OnboardingEmail';

describe('Onboarding email', () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    global.window = window
    window.scroll = jest.fn()
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
  })
  const renderComponent = (props = {}) =>
    render(
      <BrowserRouter>
        <OnboardingContext.Provider
          value={{ onboardingForms: {}, dispatchOnboardingForms: mockDispatch }}
        >
          <OnboardingEmail {...props} />
        </OnboardingContext.Provider>
      </BrowserRouter>,
    );

  it('should render', () => {
    renderComponent();
  });
});
