import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { getviewAllLegal } from 'services/api';
import useQueryParams from 'Hook/useQueryParams';
import { handleLegalSlide, isLegalOpened } from 'helpers';
import { Entermobilegetapp } from 'components/Popup';
import { useNavigate, useLocation } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import FramerMotion from 'components/animations/FramerMotion';
import { LegalCardsById } from './LegalCardsById';
import { ROUTE_LIST } from 'routes/routeList';

/**
 * A component that renders a legal page with a list of legal documents.
 *
 * It fetches the list of legal documents from the API and renders a list of
 * tabs with the document titles. When a tab is clicked, it fetches the
 * corresponding document from the API and renders it in a scrollable box.
 *
 * The component is responsive and changes its layout based on the screen size.
 *
 * It also handles the "Close" button at the top right corner of the page.
 *
 * @returns {React.ReactElement} A JSX element representing the legal page.
 */
const Legal = () => {
  const queryParams = useQueryParams();
  const type = queryParams.type || '';
  const [legalList, setLegalList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width : 699px)');

  useEffect(() => {
    if (location.pathname === ROUTE_LIST.LEGAL) {
      if (!isLegalOpened()) {
        handleLegalSlide(true);
      }
    }

    (async () => {
      try {
        const res = await getviewAllLegal(10);
        console.log(res.data);
        setLegalList(res?.data?.data);
        if (res?.data?.data && res?.data?.data[0]) {
          const findType = res?.data?.data.find(
            (ele) => ele?.legalTitle.toLowerCase() === type.toLowerCase(),
          );
          setSelectedId(findType?._id || res?.data?.data[0]._id || '');
        }
      } catch (error) {
        console.log(error);
      }
    })();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  /**
   * Handles the "Close" button at the top right corner of the legal page.
   *
   * If the user has navigated to the legal page from another page in the app
   * (i.e., there is at least one entry in the browser's history stack), this
   * function will take the user back to the previous page by calling
   * `navigate(-1)`.
   *
   * If the user has navigated to the legal page directly (i.e., there are no
   * previous entries in the browser's history stack), this function will
   * redirect the user to the landing page by calling `navigate('/')`.
   */
  const handleCloseLegal = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/'); // Redirect to landing page if no previous history
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedId(newValue);
  };

  const legalJsx = (
    <div className='common-scroll-mob sticky-tab'>
      <img
        className='close-btn'
        src='images/close-icon-white.svg'
        alt=''
        onClick={handleCloseLegal}
      />
      <h1 className='legal-heading fixed-header-pages'>Legal</h1>

      {/* Flex wrapper with gap and left alignment */}
      <div className='main-tabs'>
        <Tabs
          value={selectedId}
          onChange={handleTabChange}
          orientation={isMobile ? 'horizontal' : 'vertical'}
          className=' flex-none tab-container'
          TabIndicatorProps={{ style: { display: 'none', transition: 'none' } }}
          sx={{ flexShrink: 0 }}
        >
          {legalList?.map((legal) => (
            <Tab
              key={legal?._id}
              value={legal?._id}
              aria-setsize={legalList.length}
              disableRipple
              label={
                <div className='text-left w-full  capitalize'>
                  {isMobile ? (
                    <div className='break-words'>{legal?.legalTitle}</div>
                  ) : (
                    <Link to={`/legal?type=${legal?.legalTitle}`} className='break-words'>
                      {legal?.legalTitle}
                    </Link>
                  )}
                </div>
              }
              className={`${
                selectedId === legal._id ? ' !text-[#ffffff] tab-t ' : ' tab-t'
              } !bg-inherit mb-6`}
              sx={{ alignItems: 'flex-start' }} // Ensures text aligns to the left
            />
          ))}
        </Tabs>

        {/* This Box now has a flex-grow for dynamic sizing */}
        <Box className='faq-wrap-body legal-content-wrap flex-grow'>
          <LegalCardsById id={selectedId} />
        </Box>
      </div>
      <span className='bottom-trademark'>©2023 Black Jet Mobility Pty Ltd</span>
    </div>
  );

  return (
    <FramerMotion key={location.pathname}>
      <div id='legal-mobile' aria-label='legal-mobile-page' className='legal min-h-screen'>
        <Entermobilegetapp />
        <div className='flex justify-between'></div>
        {!legalList && selectedId === '' ? <div>Loading...</div> : legalJsx}
      </div>
    </FramerMotion>
  );
};

export default Legal;

// {
//   /* <Tabs value='html' className='main-tabs' orientation='vertical'>
//         <TabsHeader className='legal-tab-header '>
//           {legalList?.map((legal) => (
//             <Tab
//               onClick={() => {
//                 setSelectedId(legal?._id);
//               }}
//               className={` ${
//                 selectedId == legal._id ? ' !text-[#ffffff] tab-t ' : ' tab-t'
//               } !bg-inherit mb-6`}
//               // "!bg-inherit text-[#f8f6f6] mb-6"
//               key={legal?._id}
//               value={legal?.legalTitle}
//             >
//               {isMobile ? (
//                 <div className='break-words'> {legal?.legalTitle}</div>
//               ) : (
//                 <Link to={`/legal?type=${legal?.legalTitle}`} className='break-words'>
//                   {legal?.legalTitle}
//                 </Link>
//               )}
//             </Tab>
//           ))}
//         </TabsHeader>

//         <TabsBody className='faq-wrap-body legal-content-wrap'>
//           <Membership id={selectedId} />
//         </TabsBody>
//         <span className='bottom-trademark'>©2023 Black Jet Mobility Pty Ltd</span>
//       </Tabs> */
// }
