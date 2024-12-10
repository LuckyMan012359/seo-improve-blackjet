import { render, screen, fireEvent } from "@testing-library/react";
import MobileEmailSmartField from "../MobileEmailSmartField";
// import MobileEmailSmartField from "./MobileEmailSmartField";

describe("MobileEmailSmartField Component", () => {
  test("renders input field", () => {
    render(<MobileEmailSmartField />);
    
    const inputElement = screen.getByPlaceholderText(/Enter your phone number or email/i);
    expect(inputElement).toBeInTheDocument();
  });

//   test("changes from email  input to mobile input based on value", () => {
//     const setMobile = jest.fn();
//     const setEmail = jest.fn();
//     render(<MobileEmailSmartField setMobile={setMobile} setEmail={setEmail} />);

//     const inputElement = screen.getByPlaceholderText(/Enter your phone number or email/i);

//     // Simulate entering a phone number
//     fireEvent.change(inputElement, { target: { value: "+123456789" } });
//     expect(setMobile).toHaveBeenCalled();
//     expect(setEmail).not.toHaveBeenCalled();

//     // Simulate entering an email
//     fireEvent.change(inputElement, { target: { value: "test@example.com" } });
//     expect(setEmail).toHaveBeenCalled();
//   });

//   test("displays flag and country code for mobile input", () => {
//     render(<MobileEmailSmartField checkNumber={true} countryCode="+1" flag="https://flagcdn.com/us.svg" />);
    
//     const flagImage = screen.getByAltText("+1");
//     expect(flagImage).toBeInTheDocument();
//     expect(flagImage).toHaveAttribute("src", "https://flagcdn.com/us.svg");
    
//     const countryCode = screen.getByText("+1");
//     expect(countryCode).toBeInTheDocument();
//   });

//   test("displays email suggestions", () => {
//     render(<MobileEmailSmartField email="test@" />);

//     // Check if suggestions are rendered
//     const suggestion = screen.getByText(/@gmail.com/i);
//     expect(suggestion).toBeInTheDocument();
//   });
});
