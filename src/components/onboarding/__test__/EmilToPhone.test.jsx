import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingContext, { initialOnboardingState } from 'context/OnboardingContext';
import { BrowserRouter as Router } from 'react-router-dom';
import EmailToPhone from '../EmailToPhone';

// Mock the props for the component
const mockGoTo = jest.fn();
const mockSetIsAlready = jest.fn();
const mockSetCommonOnboarded = jest.fn();
const mockSetDevice = jest.fn();

const onboardingForms = {
  phone: {
    mobile: '',
    flag: 'https://flagcdn.com/au.svg',
    countryCode: '+61',
  },
  loginData: {
    newUser: false,
    randomString: 'abc123',
  },
};

const mockDispatchOnboardingForms = jest.fn();

export const renderWithProviders = (ui) => {
  return render(
    <Router>
      <OnboardingContext.Provider
        value={{
          onboardingForms: initialOnboardingState,
          dispatchOnboardingForms: mockDispatchOnboardingForms,
        }}
      >
        {ui}
      </OnboardingContext.Provider>
    </Router>
  );
};

describe('EmailToPhone component', () => {
  it('renders the component correctly', () => {
    renderWithProviders(
      <EmailToPhone
        goTo={mockGoTo}
        isMobile={true}
        setIsAlready={mockSetIsAlready}
        setCommonOnboarded={mockSetCommonOnboarded}
        setDevice={mockSetDevice}
      />
    );

    // Check if the label is rendered
    expect(screen.getByText('Enter your phone number')).toBeInTheDocument();

    // Check if the mobile field is rendered
    // expect(screen.getByRole('textbox')).toBeInTheDocument();

    // // Check if the "Send OTP" button is rendered
    // expect(screen.getByRole('button', { name: /Send OTP/i })).toBeInTheDocument();

    // // Check if the resend button is not shown initially
    // expect(screen.queryByText(/Resend OTP/i)).not.toBeInTheDocument();
  });

//   it('displays an error message when an invalid phone number is submitted', () => {
//     renderWithProviders(
//       <EmailToPhone
//         goTo={mockGoTo}
//         isMobile={true}
//         setIsAlready={mockSetIsAlready}
//         setCommonOnboarded={mockSetCommonOnboarded}
//         setDevice={mockSetDevice}
//       />
//     );

//     const sendOtpButton = screen.getByRole('button', { name: /Send OTP/i });

//     // Input an invalid phone number
//     const mobileInput = screen.getByRole('textbox');
//     fireEvent.change(mobileInput, { target: { value: 'invalid-number' } });

//     // Click the send button
//     fireEvent.click(sendOtpButton);

//     // Check if an error message is shown
//     expect(screen.getByText(/Phone number not recognized/i)).toBeInTheDocument();
//   });
});
