import { createMatchMedia } from "components/enquiryform/__test__/EnquiryForm.test";
import PreorderPeriod from "../PreorderPeriod";
import { renderWithProviders } from "./EmilToPhone.test";

describe('PreorderPeriod', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(window.innerWidth);
  });
  const mockGoTo = jest.fn();
  const mockSetIsAlready = jest.fn();
  const mockSetCommonOnboarded = jest.fn();
  const mockSetDevice = jest.fn();
  const renderWithProvidersFN = (component) => {
    renderWithProviders(
      <PreorderPeriod
        goTo={mockGoTo}
        isMobile={true}
        setIsAlready={mockSetIsAlready}
        setCommonOnboarded={mockSetCommonOnboarded}
        setDevice={mockSetDevice}
      />,
    );
  };

  it('renders the component correctly', () => { 
    renderWithProvidersFN()
  });
});
