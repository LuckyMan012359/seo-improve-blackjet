import React, { act } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// import { MUIAutoComplete } from './MUIAutoComplete';
// import { act } from 'react-dom/test-utils';
import { MUIAutoComplete } from '../MUIAutoComplete';

// Mock the required props
const mockSetValue = jest.fn();
const mockTrigger = jest.fn();
const mockRegister = jest.fn();
const mockSetError = jest.fn();
const mockOnChangeFn = jest.fn();
const mockOptions = [
  { label: 'Australia' },
  { label: 'United States' },
  { label: 'Canada' },
];

describe('MUIAutoComplete Component', () => {
  test('renders autocomplete component with initial value', () => {
    render(
      <MUIAutoComplete
        value="Australia"
        trigger={mockTrigger}
        placeholder="Select Country"
        register={mockRegister}
        setValue={mockSetValue}
        options={mockOptions}
        name="country"
        error={false}
        setError={mockSetError}
        onChangeFn={mockOnChangeFn}
      />
    );

    // Check if the placeholder and default value are rendered correctly
    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Australia');
  });

  test('calls setValue and trigger on input change', () => {
    render(
      <MUIAutoComplete
        value="Australia"
        trigger={mockTrigger}
        placeholder="Select Country"
        register={mockRegister}
        setValue={mockSetValue}
        options={mockOptions}
        name="country"
        error={false}
        setError={mockSetError}
        onChangeFn={mockOnChangeFn}
      />
    );

    // Simulate typing a value in the autocomplete input field
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'United States' } });

    // Check if setValue and trigger were called
    expect(mockSetValue).toHaveBeenCalledWith('country', 'United States');
    expect(mockTrigger).toHaveBeenCalledWith('country');
  });

  test('displays error when input value is not in the options list', async () => {
    render(
      <MUIAutoComplete
        value=""
        trigger={mockTrigger}
        placeholder="Select Country"
        register={mockRegister}
        setValue={mockSetValue}
        options={mockOptions}
        name="country"
        error={false}
        setError={mockSetError}
        onChangeFn={mockOnChangeFn}
      />
    );

    const input = screen.getByRole('combobox');

    // Simulate typing an invalid value
   
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(() => {
      fireEvent.change(input, { target: { value: 'Unknown Country' } });
    });

    // Expect setError to be called
    expect(mockSetError).toHaveBeenCalledWith('country', {
      type: 'custom',
      message: `Oops! We couldn't find that country.  Please double-check your entry.`,
    });
  });

  test('handles selection from the options', async () => {
    render(
      <MUIAutoComplete
        value=""
        trigger={mockTrigger}
        placeholder="Select Country"
        register={mockRegister}
        setValue={mockSetValue}
        options={mockOptions}
        name="country"
        error={false}
        setError={mockSetError}
        onChangeFn={mockOnChangeFn}
      />
    );

    // Open the options and select one
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Canada' } });

    expect(mockSetValue).toHaveBeenCalledWith('country', 'Canada');
    expect(mockTrigger).toHaveBeenCalledWith('country');
  });
});
