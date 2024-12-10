import React from 'react';
import { render, screen } from '@testing-library/react';
import Landscape from '../Landscape';

describe('Landscape Component', () => {
  test('renders the landscape text and message', () => {
    render(<Landscape />);

    // Check if the heading is rendered
    const headingElement = screen.getByRole('heading', {
      name: /we’re sorry, but this page does not support landscape view/i,
    });
    expect(headingElement).toBeInTheDocument();

    // Check if the paragraph instructing to rotate the phone is rendered
    const rotateText = screen.getByText(/please rotate your phone to portrait mode/i);
    expect(rotateText).toBeInTheDocument();

    // Check if the footer copyright text is rendered
    const copyrightText = screen.getByText(/©2023 black jet mobility pty ltd/i);
    expect(copyrightText).toBeInTheDocument();
  });
});
