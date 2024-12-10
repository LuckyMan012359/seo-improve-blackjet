import PaymentMethod from '../PaymentMethod';
import { renderWithProviders } from './EmilToPhone.test';

describe('PaymentMethod Component', () => {
  const mockSetIsAlready = jest.fn();

  it('renders the component correctly', async  () => {
    renderWithProviders(
      <PaymentMethod
        goTo={1}
        isMobile={true}
        setIsAlready={mockSetIsAlready}
        setCommonOnboarded={mockSetIsAlready}
        setDevice={mockSetIsAlready}
      />,
    );
  });
});
