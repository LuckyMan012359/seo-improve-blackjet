import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleAboutSlide, isAboutOpened } from 'helpers';
import CommonButton from 'components/formcomponents/CommonButton';
import { Entermobilegetapp } from 'components/Popup';

import { useBlackJetContext } from 'context/OnboardingContext';

import { CHANGE_PREORDER_STATUS } from 'constants/actions';
import FramerMotion from 'components/animations/FramerMotion';
import { footerText } from './aboutConstant';
import { useMediaQuery } from '@mui/material';
import { ROUTE_LIST } from 'routes/routeList';
import { about1, about2, about3, about4, aboutRightImg, aboutUsLeftImg } from 'assets';

const AboutUs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onboardingForms, dispatchOnboardingForms } = useBlackJetContext();
  const details = onboardingForms?.membershipData;
  const isMobile = useMediaQuery('(max-width : 699px)');

  const handlePreOrder = () => {
    dispatchOnboardingForms({ type: CHANGE_PREORDER_STATUS, payload: true });
    if (isMobile) {
      // toggleDrawer()
      navigate(ROUTE_LIST.PHONE_ONBOARDING);
    } else {
      navigate(`${ROUTE_LIST.SMART_FIELD}?type=pre-order`);
    }
  };
  // {!details.preOrder ? 'Become a member' : 'Pre-order now'}
  useEffect(() => {
    if (location.pathname === ROUTE_LIST.ABOUT_US) {
      if (!isAboutOpened()) {
        handleAboutSlide(true);
      }
    }
  }, [location.pathname]);

  // if (!details) return null;

  const handleCloseAboutUs = () => {
    // setTimeout(() => {
    if (window.history.length > 2) {
      // Check for at least two entries (SPA + initial visit)
      navigate(-1);
    } else {
      navigate('/'); // Redirect to landing page if no previous history
    }
    // }, 250);
    // handleAboutSlide();
  };

  return (
    <FramerMotion key={location.pathname}>
      <div className='about-main-div' id='about-mobile'>
        <Entermobilegetapp />
        <img
          className='close-btn'
          src='images/close-icon-white.svg'
          alt=''
          onClick={handleCloseAboutUs}
        />
        <div class='faq-heading faqm fixed-header-pages'>&nbsp;</div>
        <div className='common-scroll-mob'>
          <div className='about-us-wrapper'>
            <div className='image-section'>
              <div className='upper-img'>
                <img src={about1} alt='' />
                <img src={about2} alt='' />
              </div>
              <div className='about-heading'>About us</div>
              <div className='lower-img'>
                <img src={about3} alt='' />
                <img src={about4} alt='' />
              </div>
            </div>
          </div>
          <div className='empower'>
            <h2>Empowering you with personal flights</h2>
          </div>
          <div className='found-in-sydney'>
            <div className='found-txt'>
              <h3>Founded in Sydney</h3>
              <p>
                Our journey began in mid-2022, with the aim of achieving CASR Part 135
                certification, guided by a spirit of excellence and an unwavering commitment to
                safety. Thanks to the dedication of our certification team, we have developed over
                600 pages of comprehensive operating procedures, training and checking program, and
                safety management system, each meticulously tailored to meet the unique requirements
                of our aircraft type, pilots, and ground crew.
              </p>
              <p className='found-p'>
                Utilizing the latest software technologies such as React.js, Node.js, Flutter, JuMP,
                and MongoDB, our software team developed an integrated booking platform and internal
                management system to streamline the flight booking process and enhance the overall
                management experience, significantly improving our operational efficiency and
                customer service.{' '}
              </p>
              <p>
                As we move forward, with anticipation of receiving our certification by Spring 2024,
                we extend an invitation to you to become part of this journey. Together, we aim to
                transform private jet travel into an accessible, safe, and personalized experience.
              </p>
            </div>
            <div className='found-img'>
              <img src={aboutUsLeftImg} alt='about-left' />
            </div>
          </div>
          <div className='found-in-sydney mission'>
            <div className='found-img'>
              <img src={aboutRightImg} alt='about-right' />
            </div>
            <div className='found-txt'>
              <h3>Our mission</h3>
              <p>
                As an wholly Australian company rooted in Sydney, our mission is to redefine the
                essence of travel by making private jet experiences accessible and appealing to a
                broader audience. We prioritize safety above all, ensuring peace of mind for every
                member aboard our flights.{' '}
              </p>
              <p className='found-p'>
                Our commitment to convenience, consistency, and efficiency transforms travel into a
                seamless journey, allowing our members to reclaim valuable time. We are dedicated to
                providing an unparalleled travel experience that not only connects destinations but
                also brings people closer to their colleagues, business partners, and loved ones,
                making every moment count.
              </p>
            </div>
          </div>

          <div className='value-wrap'>
            <h1>Our values</h1>
            <div className='value-card-wrap'>
              <div className='value-card'>
                <img srcSet='../images/value1.svg' alt='' />
                <h4>Customer Service</h4>
                <p>
                  Customers are the heart of Black Jet. We strive to put customer's first with
                  personalized attention, swift response to requests, and a warm, welcoming
                  atmosphere. Our team is committed to making every journey seamless and enjoyable,
                  ensuring our members feel valued and respected at every touchpoint.
                </p>
              </div>
              <div className='value-card'>
                <img className='safety-img' srcSet='../images/value2.svg' alt='' />
                <h4>Safety</h4>
                <p>
                  Our top priority is your well-being. With rigorous maintenance schedules, advanced
                  safety protocols, and highly trained personnel, we ensure a secure and reliable
                  flying experience. Safety isn't just a policy; it's our core commitment to every
                  member.
                </p>
              </div>
              <div className='value-card'>
                <img className='tech-img' srcSet='../images/value3.svg' alt='' />
                <h4>Tech-Advanced</h4>
                <p>
                  At the core of our mission is the fusion of aviation and intuitive mobile
                  software, crafting a travel experience where technology feels like second nature.
                  We believe in technology that simplifies, not complicates, allowing you to focus
                  on what's important to you, while we take care of the rest. With us, travel isn't
                  just a process; it's a breeze.
                </p>
              </div>
            </div>
            <div className='head-div'>
              <div className='headquater-wrap'>
                <div>
                  <h3>Headquartered in Sydney</h3>
                  <p>
                    We are a proudly Australian company, headquartered in Sydney with
                    <br />
                    <span>our</span> primary operations centered at Sydney Bankstown Aerodrome.
                  </p>
                </div>
                <div className='airport-wrap'>
                  <div className='airport-inner'>
                    <div className='airport-div'>
                      <div className='air-img'>
                        <img srcSet='../images/head1.svg' alt='' />
                      </div>
                      <h3>Sydney</h3>
                    </div>
                    <div className='airport-subhead'>Bankstown Airport</div>
                  </div>
                  <div className='airport-inner'>
                    <div className='airport-div'>
                      <div className='air-img'>
                        <img srcSet='../images/head2.svg' alt='' />
                      </div>
                      <h3>Melbourne</h3>
                    </div>
                    <div className='airport-subhead'>Essendon Fields Airport</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className='meet-main-wrap'>
            <h1 className='meet-heading'>Meet the team</h1>

            <div className='meet-card-wrap'>
              <div className='meet-card meet-card-1'>
                <img srcSet='../images/meet1.svg' alt='' />
                <h4 className='meet-title'>Eddison</h4>
                <h5 className='meet-subtitlr'>Manager</h5>
                <p className='meet-p'>
                  Lorem ipsum dolor sit amet consectetur. Purus urna blandit commodo quam diam neque
                  sit mattis pretium.
                </p>
              </div>
              <div className='meet-card meet-card-2'>
                <img srcSet='../images/meet2.svg' alt='' />
                <h4 className='meet-title'>Eddison</h4>
                <h5 className='meet-subtitlr'>Manager</h5>
                <p className='meet-p'>
                  Lorem ipsum dolor sit amet consectetur. Purus urna blandit commodo quam diam neque
                  sit mattis pretium.
                </p>
              </div>
              <div className='meet-card meet-card-3'>
                <img srcSet='../images/meet3.svg' alt='' />
                <h4 className='meet-title'>Eddison</h4>
                <h5 className='meet-subtitlr'>Manager</h5>
                <p className='meet-p'>
                  Lorem ipsum dolor sit amet consectetur. Purus urna blandit commodo quam diam neque
                  sit mattis pretium.
                </p>
              </div>
              <div className='meet-card meet-card-4'>
                <img srcSet='../images/meet4.svg' alt='' />
                <h4 className='meet-title'>Eddison</h4>
                <h5 className='meet-subtitlr'>Manager</h5>
                <p className='meet-p'>
                  Lorem ipsum dolor sit amet consectetur. Purus urna blandit commodo quam diam neque
                  sit mattis pretium.
                </p>
              </div>
            </div>
          </div> */}
          {details && (
            <div className='join-wrapper'>
              <h1 className='join-heading'>Join us and take off</h1>
              <p className='join-p'>
                {!details?.preOrder
                  ? '  Why hesitate? Become a member now and enjoy the advantage without any risk. '
                  : 'Why hesitate? Pre-order now and enjoy the advantage without any risk.'}
              </p>
              <div className='btn-wrap '>
                <CommonButton
                  text={<div>{!details?.preOrder ? 'Become a member' : 'Pre-order now'}</div>}
                  className='join-btn pre-order-simmer-effect'
                  onClick={handlePreOrder}
                />
              </div>
            </div>
          )}
          <div className='about-mob-page-footer'>
            <div className='footer-description'>
              <p>{footerText.description}</p>
            </div>
            <div className='footer-contact'>
              <div className='footer-title'>
                <span className='footer-title-text'>
                  {isMobile && '©2023'} {footerText.title}{' '}
                </span>

                {isMobile && <br />}
                <span className='footer-title-abn'>{footerText.titleAbn}</span>
              </div>
              <div className='footer-address'>{footerText.address}</div>
            </div>
          </div>
        </div>
      </div>
    </FramerMotion>
  );
};

export default AboutUs;
