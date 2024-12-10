import React from 'react';
import { render, screen } from '@testing-library/react';
import ResendButton, { INITIAL_TIMING } from '../ResendButton';

describe('ResendButton', () => {
  it('renders with the correct initial text and disabled state', () => {
    render(<ResendButton resendOtp={jest.fn()} />);

    const button = screen.getByRole('button', { name: `Resend code (${INITIAL_TIMING})` });

    // Check that the button is initially disabled and has the correct text
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button.textContent).toBe(`Resend code (${INITIAL_TIMING})`);
  });
});
