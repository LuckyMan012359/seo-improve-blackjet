import { renderWithProviders } from "components/onboarding/__test__/EmilToPhone.test";
import OtpScreen from "../OtpScreen";

describe('OtpScreen', () => {
  const renderComponent = (contextValues = {}) => {
    renderWithProviders(<OtpScreen />);
  };

  it('renders correctly', () => {
    renderComponent();
    // expect(screen.getByText('Phone Recognized')).toBeInTheDocument();
  });
});
