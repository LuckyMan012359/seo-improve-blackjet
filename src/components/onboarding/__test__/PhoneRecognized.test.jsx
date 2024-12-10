import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// import PhoneRecognized from './PhoneRecognized'; // Adjust import based on your file structure
import { OnboardingContext } from 'context/OnboardingContext';
import { apiCheckReferralLink, loginuser, loginuserotp } from 'services/api';
import { showError } from 'utils/notify';
import PhoneRecognized from '../PhoneRecognized';
import { renderWithProviders } from './EmilToPhone.test';
import { createMatchMedia } from 'components/enquiryform/__test__/EnquiryForm.test';

// Mock APIs and helpers
jest.mock('services/api', () => ({
  apiCheckReferralLink: jest.fn(),
  loginuser: jest.fn(),
  loginuserotp: jest.fn(),
}));

jest.mock('utils/notify', () => ({
  showError: jest.fn(),
}));

describe('PhoneRecognized Component', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(window.innerWidth);
  });
  const mockDispatch = jest.fn();
  const mockGoTo = jest.fn();

  const renderComponent = (contextValues = {}) => {
    renderWithProviders(<PhoneRecognized goTo={mockGoTo} />);
  };

  it('renders correctly', () => {
    renderComponent();
    // expect(screen.getByText('Phone Recognized')).toBeInTheDocument();
  });
});
