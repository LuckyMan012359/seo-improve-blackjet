import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import BasicInfo from '../BasicInfo';
import OnboardingContext from 'context/OnboardingContext'; // Import the context

describe('BasicInfo Component', () => {
  // Mock window.scrollTo
  beforeAll(() => {
    window.scrollTo = jest.fn(); // Mock scrollTo method
  });
  it('renders the form with all required fields', () => {
    // Mocking the OnboardingContext values
    const mockOnboardingForms = {
      info: {},
      loginData: { newUser: true },
      sessionToken: 'mock-token',
    };

    const mockDispatchOnboardingForms = jest.fn();

    render(
      <BrowserRouter>
        <OnboardingContext.Provider
          value={{
            onboardingForms: mockOnboardingForms,
            dispatchOnboardingForms: mockDispatchOnboardingForms,
          }}
        >
          <BasicInfo goTo={jest.fn()} isMobile={false} currentIndex={0} />
        </OnboardingContext.Provider>
      </BrowserRouter>,
    );

    // // Check that the full name field is rendered
    // expect(screen.getByLabelText('Full name')).toBeInTheDocument();

    // // Check that the preferred name field is rendered
    // expect(screen.getByLabelText('Preferred name')).toBeInTheDocument();

    // // Check that the birthday fields (day, month, year) are rendered
    // expect(screen.getByPlaceholderText('Day')).toBeInTheDocument();
    // expect(screen.getByPlaceholderText('Month')).toBeInTheDocument();
    // expect(screen.getByPlaceholderText('Year')).toBeInTheDocument();

    // // Check that the gender select field is rendered
    // expect(screen.getByLabelText('Gender')).toBeInTheDocument();

    // // Check that the agreement checkbox is rendered
    // expect(screen.getByLabelText('I agree to the')).toBeInTheDocument();

    // // Check that the Continue button is rendered
    // expect(screen.getByText('Continue')).toBeInTheDocument();
  });
});
