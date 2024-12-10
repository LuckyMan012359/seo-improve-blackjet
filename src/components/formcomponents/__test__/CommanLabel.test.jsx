import { render, screen } from "@testing-library/react";
import CommonLabel from "../CommonLabel";
// import CommonLabel from "./CommonLabel";

describe("CommonLabel Component", () => {
  test("renders the label correctly", () => {
    render(<CommonLabel label="Main Label" />);
    
    // Check if the main label is rendered
    const label = screen.getByText("Main Label");
    expect(label).toBeInTheDocument();
  });

  test("renders the optional label when provided", () => {
    render(<CommonLabel label="Main Label" optionalLabel="Optional Label" />);
    
    // Check if the optional label is rendered
    const optionalLabel = screen.getByText("Optional Label");
    expect(optionalLabel).toBeInTheDocument();
  });

  test("applies the optional-label class to the optional label", () => {
    render(<CommonLabel label="Main Label" optionalLabel="Optional Label" />);
    
    // Check if the optional label has the correct class
    const optionalLabel = screen.getByText("Optional Label");
    expect(optionalLabel).toHaveClass("optional-label");
  });



  test("renders only the main label when no optional label is provided", () => {
    render(<CommonLabel label="Main Label" />);
    
    // Check if the main label is rendered, and no optional label exists
    const label = screen.getByText("Main Label");
    expect(label).toBeInTheDocument();
    expect(screen.queryByText("Optional Label")).toBeNull();
  });
});
