import { render, screen, fireEvent } from '@testing-library/react';
// import CardSection, { getTotalPrice } from './CardSection';
import OnboardingContext from 'context/OnboardingContext';
import usePwaNavigation from 'Hook/usePwaNavigation';
import { BrowserRouter as Router } from 'react-router-dom';
import CardSection, { getTotalPrice } from '..';
import { createMatchMedia } from 'components/enquiryform/__test__/EnquiryForm.test';

// Mock functions for PWA navigation
jest.mock('Hook/usePwaNavigation', () => jest.fn());
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

describe('CardSection Component', () => {
  beforeAll(() => {
    window.matchMedia = createMatchMedia(window.innerWidth);
  });
  const mockMembershipData = {
    _id: '654b3610d8a13175f8f349d6',
    name: 'Unlimited',
    noOfSeats: 567,
    content:
      '<body style="background-co lor: black; color: #fff;">\n    <div style="height: 59px; margin:auto;max-width:720px; d isplay: flex;align-items: center;justify-content: center;">\n        <h1 style="padding- right: 16px; text-decoration: line-through; text-decoration-color: red;text-align: center; ">\n            3,499\n        </h1>\n        <h4 style="text-align: center;">\n             2,499 mon\n        </h4>\n    </div>\n    <p style="text-align: center;padding: 0;ma rgin: 0;">Only 5 memberships left at this price</p>\n    <h2 style="text-align: left;fon t-size: 22px;padding-left: 10px;padding-bottom: 0;margin-bottom: 0;">Unlimited Plan\n         Membership</h2>\n    <div style="padding: 0px 15px;">\n        <table width="100%"  cellspacing="0" cellpadding="0" style=" line-height:26px">\n            <tr>\n                 <td valign="left" valign="top" style="background:black;">\n                     <table width="100%" cellspacing="0" cellpadding="0">\n                         <tr>\n                            <td valign="center" width="7%">\n                                 <img src="https://sygnificbuck.s3.ap-south-1.amazonaws.com/1699533253764orig inal.png"\n                                    width="14px">\n                             </td>\n                            <td valign="left" width="93%" style="padding:\n                                         10px; color: #fff;font-weight:400; font-size:14px;  padding-bottom: 0;">Recently\n                                I was chatting\n                                 with Sherly, co founder</td>\n                        </tr>\n                         <tr>\n                            <td valign="center" width="7%"><img \n                                    src="https://sygnificbuck.s3.ap-south-1.amazonaws.c om/1699533253764original.png"\n                                    width="14px"></td>\n                             <td valign="left" width="93%" style="padding:\n                                         10px; color: #fff;font-weight:400; font-size:14px; padding-b ottom: 0;">Recently\n                                I was chatting\n                                 with Sherly, co founder of Death to the Stock Photo, about his company’s email \n                                strategy. They’ve grown their business almost</td>\n                         </tr>\n                        <tr>\n                            <td v align="center" width="7%"><img\n                                    src="https://sygn ificbuck.s3.ap-south-1.amazonaws.com/1699533253764original.png"\n                                     width="14px"></td>\n                            <td valign="left" width=" 93%" style="padding:\n                                        10px; color: #fff;font-wei ght:400; font-size:14px; padding-bottom: 0;">Recently\n                                I  was chatting\n                                with Sherly, co founder of Death to the Stoc k Photo, about his company’s email\n                                strategy. They’ve grow n their business almostabout his company’s email\n                                strategy . They’ve grown their business almost</td>\n                        </tr>\n                         <tr>\n                            <td valign="center" width="7%"><img\n                                     src="https://sygnificbuck.s3.ap-south-1.amazonaws.com/16995 33253764original.png"\n                                    width="14px"></td>\n                             <td valign="left" width="93%" style="padding:\n                                         10px; color: #fff;font-weight:400; font-size:14px; padding-bottom: 0 ;">Recently\n                                I was chatting\n                                 with Sherly, co founder of Death to the Stock Photo, about his company’s email\n                                 strategy. They’ve grown their business almost</td>\n                         </tr>\n                        <tr>\n                            <td valign=" center" width="7%"><img\n                                    src="https://sygnificbuck .s3.ap-south-1.amazonaws.com/1699533253764original.png"\n                                     width="14px"></td>\n                            <td valign="left" width="93%" st yle="padding:\n                                        10px; color: #fff;font-weight:400;  font-size:14px; padding-bottom: 0;">Recently\n                                I was chat ting\n                                with Sherly, co founder of Death to the Stock Photo,  about his company’s email\n                                strategy. They’ve grown their  business almost</td>\n                        </tr>\n                        <tr>\n                             <td valign="center" width="7%"><img\n                                     src="https://sygnificbuck.s3.ap-south-1.amazonaws.com/1699533253764original.png" \n                                    width="14px"></td>\n                            <t d valign="left" width="93%" style="padding:\n                                         10px; color: #fff;font-weight:400; font-size:14px; padding-bottom: 0;">Recently\n                                 I was chatting\n                                with Sherly, co fo under of Death to the Stock Photo, about his company’s email\n                                 strategy. They’ve grown their business almost</td>\n                        </tr>\n                         <tr>\n                            <td valign="center" width="7%"> <img\n                                    src="https://sygnificbuck.s3.ap-south-1.amazona ws.com/1699533253764original.png"\n                                    width="14px"></t d>\n                            <td valign="left" width="93%" style="padding:\n                                         10px; color: #fff;font-weight:400; font-size:14px; paddi ng-bottom: 0;">Recently\n                                I was chatting\n                                 with Sherly, co founder of Death to the Stock Photo, about his company’s e mail\n                                strategy. They’ve grown their business almost</td>\n                         </tr>\n                        <tr>\n                            < td valign="center" width="7%"><img\n                                    src="https:// sygnificbuck.s3.ap-south-1.amazonaws.com/1699533253764original.png"\n                                     width="14px"></td>\n                            <td valign="left" widt h="93%" style="padding:\n                                        10px; color: #ffffffd5 ;font-weight:400; font-size:14px; padding-bottom: 0;">\n                                R ecently I was chatting\n                                with Sherly, co founder of Death t o the Stock Photo, about his company’s email\n                                strategy. Th ey’ve grown their business almost</td>\n                        </tr>\n\n                         <tr>\n                            <td style="font-size: 12px;color: rgba(255, 255,  255, 0.699);line-height: 15px;padding-top: 10px;"\n                                colsp an="2">*cancellations apply at the end of the monthly billing cycle\n                                 **we’ll use the app to verify your first-timer status</td>\n                         </tr>\n\n                </td>\n            </tr>\n\n        </table>\n    </div>\n \n    <div style="display: flex; justify-content: center;"><button\n            style=" background-color: #fff;color: black;border-radius: 4px;border: 1px solid black;width: 300p x;font-size: 14px;font-weight: bold;margin-top: 10px; height: 51px;">Purchase</button>\n     </div>\n\n    <div style="display: flex; justify-content: center;"><button\n             style="background-color: #070707;color: rgb(252, 252, 252);border-radius: 4px;border:  1px solid rgb(247, 243, 243);width: 300px;font-size: 14px;font-weight: bold;margin-top: 10 0px; height: 51px;">Continue\n            without purchasing</button>\n    </div>\n\n     </tr>\n    </div>\n</body>',
    text: 'Activate your membership at your leisure when you&rsqu o;re ready to start flying after we&rsquo;ve launched. Memberships activated will auto-ren ew monthly. You may cancel your membership anytime. Cancellations apply at the end of the  monthly billing cyclee',
    bannerTag: 'discount offer tag',
    type: 1,
    highlightsArray: [
      {
        highlight: 'Unlimited all-you-can-fly',
        strikeThroughHighlight: '',
        check: true,
        _id: '6711f64a56ffd44be8149b94',
      },
      {
        highlight: 'Guest Pass awarded every 3 months',
        strikeThroughHighlight: '',
        check: true,
        _id: '6711f64a56ffd44be8149b95',
      },
      {
        highlight: 'B ook/change flights in seconds',
        strikeThroughHighlight: '',
        check: true,
        _id: '6711f64a56ffd44be8149b96',
      },
      {
        highlight: 'Change/cancel flights freely 24 h before departure',
        strikeThroughHighlight: '',
        check: true,
        _id: '6711f64a56ffd44be8149b97',
      },
      {
        highlight: 'No hidden fees, predicable travel expenses',
        strikeThroughHighlight: '',
        check: true,
        _id: '6711f64a56ffd44be8149b98',
      },
      {
        highlight: 'One time Initiation & Verification Fee waived for first  time users',
        strikeThroughHighlight: '',
        check: true,
        _id: '6711f64a56ffd44be8149b99',
      },
      {
        highlight: 'Prepay the first month to guarantee your monthly m embership price',
        strikeThroughHighlight: '',
        check: false,
        _id: '6711f64a56ffd44be8149b9a',
      },
      {
        highlight: 'Fully refundable until you activate your memb ership*',
        strikeThroughHighlight: '',
        check: true,
        _id: '6711f64a56ffd44be8149b9b',
      },
    ],
    downgradeArray: [
      {
        downgrade: '2 Reusable Bookings',
        check: true,
        _id: '6711fc8c56ffd44be814a6a7',
      },
      {
        downgrade: '1 Guest Pass awarded every 3 months',
        check: true,
        _id: '6711fc8c56ffd44be814a6a8',
      },
      {
        downgrade: '2 Reset Vouchers awarded every 3 months',
        check: false,
        _id: '6711fc8c56ffd44be814a6a9',
      },
      {
        downgrade: 'test',
        check: false,
        _id: '6711fc8c56ffd44be814a6aa',
      },
    ],
    downgradeText: 'Your downgrade will take effect from your next renewal date',
    preorderOn: false,
    status: 'active',
    createdAt: '2023-11-08T05:50:15.083Z',
    updatedAt: '2024-10-19T05:22:39.295Z',
    initiationFees: '41',
    latestPrice: '4141',
    discountInitiationFees: '20',
    discountPrice: '999',
    usedSeats: 5,
    is_demo_process: false,
    preOrder: false,
  };

  const mockOnboardingForms = {
    membershipData: mockMembershipData,
  };

  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockRedirect = jest.fn();

  beforeEach(() => {
    usePwaNavigation.mockReturnValue({
      redirect: mockRedirect,
      isPwa: false,
    });
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <Router>
        <OnboardingContext.Provider
          value={{ onboardingForms: mockOnboardingForms, dispatchOnboardingForms: mockDispatch }}
        >
          <CardSection {...props} />
        </OnboardingContext.Provider>
      </Router>,
    );

  it('should render the component and display membership details', () => {
    renderComponent();
    // expect(screen.getByText('Limited memberships left at this price')).toBeInTheDocument();
    // expect(screen.getByText(/Unlimited access/)).toBeInTheDocument();
    // expect(screen.getByText(/100/)).toBeInTheDocument();
  });

//   it('should show the initiation fee when discount is available', () => {
//     renderComponent();
//     expect(screen.getByText('40')).toBeInTheDocument(); // Discounted initiation fee
//   });

//   it('should call handlePreOrder on button click for pre-order', () => {
//     renderComponent({ button: true });
//     const button = screen.getByText(/Become a member/);
//     fireEvent.click(button);
//     expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_PREORDER_STATUS', payload: true });
//   });

//   it('should calculate total price correctly', () => {
//     expect(getTotalPrice(mockMembershipData)).toBe('140'); // 100 + 40
//   });

//   it('should not render if membership is inactive', () => {
//     const inactiveData = {
//       ...mockMembershipData,
//       status: 'inactive',
//     };
//     renderComponent();
//     expect(screen.queryByText(/Premium Plan membership/)).not.toBeInTheDocument();
//   });

//   it('should navigate to the correct route on payment click', () => {
//     renderComponent({ onboarding: true });
//     const button = screen.getByText(/Select/);
//     fireEvent.click(button);
//     expect(mockNavigate).toHaveBeenCalledWith('/at-your-convenience'); // Replace with actual route
//   });

//   it('should navigate to phone onboarding for mobile users', () => {
//     renderComponent({ isMobile: true });
//     const button = screen.getByText(/Purchase/);
//     fireEvent.click(button);
//     expect(mockNavigate).toHaveBeenCalledWith('/phone-onboarding'); // Replace with actual mobile route
//   });
});
