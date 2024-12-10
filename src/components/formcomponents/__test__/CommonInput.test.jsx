import { render, screen, fireEvent } from "@testing-library/react";
import CommonInput from "../CommonInput";
// import CommonInput from "./CommonInput";

describe("CommonInput Component", () => {
  test("renders the input with placeholder text", () => {
    render(<CommonInput placeholder="Enter text" value="" controlled={true} />);

    // Check if the input is rendered with the correct placeholder
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });

  test("applies the 'focused-input' class on focus", () => {
    render(<CommonInput placeholder="Enter text" value="" controlled={true} />);

    const input = screen.getByPlaceholderText("Enter text");

    // Simulate focus event
    fireEvent.focus(input);

    // Check if the 'focused-input' class is applied
    expect(input).toHaveClass("focused-input");
  });

  test("removes the 'focused-input' class on blur", () => {
    render(<CommonInput placeholder="Enter text" value="" controlled={true} />);

    const input = screen.getByPlaceholderText("Enter text");

    // Simulate focus and then blur event
    fireEvent.focus(input);
    fireEvent.blur(input);

    // Check if the 'focused-input' class is removed
    expect(input).not.toHaveClass("focused-input");
  });

  test("calls onChange handler when input value changes", () => {
    const handleChange = jest.fn();
    render(<CommonInput onChange={handleChange} value="" controlled={true} />);

    const input = screen.getByPlaceholderText("");

    // Simulate changing the input value
    fireEvent.change(input, { target: { value: "New value" } });

    // Check if the onChange handler was called
    expect(handleChange).toHaveBeenCalled();
  });

  test("calls onKeyDown handler when key is pressed", () => {
    const handleKeyDown = jest.fn();
    render(<CommonInput onKeyDown={handleKeyDown} value="" controlled={true} />);

    const input = screen.getByPlaceholderText("");

    // Simulate a key down event
    fireEvent.keyDown(input, { key: "Enter" });

    // Check if the onKeyDown handler was called
    expect(handleKeyDown).toHaveBeenCalled();
  });

  test("renders as read-only when readOnly prop is true", () => {
    render(<CommonInput readOnly={true} value="Read only value" controlled={true} />);

    const input = screen.getByDisplayValue("Read only value");

    // Check if the input is rendered as read-only
    expect(input).toHaveAttribute("readOnly");
  });

  test("renders as disabled when disabled prop is true", () => {
    render(<CommonInput disabled={true} value="Disabled value" controlled={true} />);

    const input = screen.getByDisplayValue("Disabled value");

    // Check if the input is rendered as disabled
    expect(input).toBeDisabled();
  });
});
