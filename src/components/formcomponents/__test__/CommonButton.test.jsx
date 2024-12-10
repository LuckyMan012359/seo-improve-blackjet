import { render, screen, fireEvent } from "@testing-library/react";
import CommonButton from "../CommonButton";
// import CommonButton from "./CommonButton";

describe("CommonButton Component", () => {
  test("renders the button with provided text", () => {
    render(<CommonButton text="Click Me" />);

    // Check if the button is rendered with the correct text
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("applies the disabled class when there is an error", () => {
    render(<CommonButton text="Click Me" error={true} disabledClass="disable-btn" />);

    // Check if the disabled class is applied when error is true
    const button = screen.getByText("Click Me");
    expect(button).toHaveClass("disable-btn");
  });

  test("handles onClick event", () => {
    const handleClick = jest.fn();
    render(<CommonButton text="Click Me" onClick={handleClick} />);

    // Simulate a click on the button
    const button = screen.getByText("Click Me");
    fireEvent.click(button);

    // Check if the onClick handler was called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("applies pressed class when button is pressed", () => {
    render(<CommonButton text="Click Me" pressedClass="pressed-btn" />);

    const button = screen.getByText("Click Me");

    // Simulate pressing down on the button (mouse or touch)
    fireEvent.mouseDown(button);
    expect(button).toHaveClass("pressed-btn");

    // Simulate releasing the press
    fireEvent.mouseUp(button);
    expect(button).not.toHaveClass("pressed-btn");
  });

  test("does not apply pressed class after mouse leaves button", () => {
    render(<CommonButton text="Click Me" pressedClass="pressed-btn" />);

    const button = screen.getByText("Click Me");

    // Simulate pressing and mouse leaving the button
    fireEvent.mouseDown(button);
    fireEvent.mouseLeave(button);

    // Check that pressed class is removed after mouse leaves
    expect(button).not.toHaveClass("pressed-btn");
  });
});
