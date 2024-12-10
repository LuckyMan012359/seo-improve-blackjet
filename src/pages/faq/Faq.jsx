import React, { useEffect, useState } from 'react';
import { getCategoryList, getEnquiryList, getFaqQuestions } from 'services/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useMediaQuery } from '@mui/material';
import { handleFaqSlide, isFaqOpened } from 'helpers';
import { Entermobilegetapp } from 'components/Popup';
import { useNavigate, useLocation } from 'react-router-dom';
import { isEmpty } from 'helpers/common';
import FramerMotion from 'components/animations/FramerMotion';
import { ROUTE_LIST } from 'routes/routeList';

/**
 * The Faq component renders a list of FAQs from the API and allows the user to select a category.
 * It also renders a form to submit an enquiry.
 *
 * @return {ReactElement} The Faq component.
 */
const Faq = () => {
  const schema = yup.object({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    email: yup.string().required('Email is required'),
    phone: yup.string().required('Phone is required'),
    subject: yup.string().required('Subject is required'),
    enQuiry: yup.string().required('enQuiry is required'),
    relatedEnquiry: yup.string().required('rRelated Enquiry is required'),
    type: yup.string().default('faq'),
    isConfirm: yup.boolean().required('Agree'),
  });

  const [questions, setQuestions] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [limit] = useState(6);
  const isTabMobile = useMediaQuery('(max-width : 530px)');
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const {
    // register,
    // handleSubmit,
    // reset,
    setValue,
    // getValues,
    // trigger,

    // formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getCategoryList();
        console.log(res.data);
        setCategoryList(res?.data?.data);
        setSelectedCategory(res?.data?.data?.find((item) => item) || {});
      } catch (error) {
        console.log(error);
      }
      try {
        const res = await getEnquiryList();
        // console.log(res.data);
        setValue('relatedEnquiry', res?.data?.data[0]);
      } catch (error) {
        console.log(error);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isTabMobile && location.pathname === ROUTE_LIST.FAQ) {
      if (!isFaqOpened()) {
        handleFaqSlide(true);
      }
    }
    (async () => {
      if (selectedCategory?._id) {
        try {
          const res = await getFaqQuestions(selectedCategory?._id, limit);
          // console.log(res.data);
          setQuestions(res?.data?.data);
        } catch (error) {
          console.log(error);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory?._id, limit]);

  /**
   * Handles the closing of the FAQ page, navigating either to the previous
   * page in the history stack (if available) or to the landing page.
   */
  const handleCloseFaq = () => {
    if (window.history.length > 2 && !isEmpty(window.history.state)) {
      // Check for at least two entries (SPA + initial visit)
      navigate(-1);
    } else {
      navigate('/'); // Redirect to landing page if no previous history
    }

    // handleFaqSlide(false);
  };

  return (
    <FramerMotion>
      <Entermobilegetapp />
      <div id='mobile-faq' className='faq-main-wrapper' onWheel={(e) => e.stopPropagation()}>
        <div className='faq-heading mobile-hide'>Frequently Asked Questions</div>
        <div className='faq-heading faqm fixed-header-pages sticky-tab'>
          <img
            className='close-btn'
            src='images/close-icon-white.svg'
            alt=''
            onClick={handleCloseFaq}
          />
          <span className='mob-faq-heading'>FAQs</span>
          <div id='FAQCategoriesRoot' className='faq-tabs-wrap'>
            {categoryList?.map((category) => (
              <div
                key={category?._id}
                id='FAQSections'
                className={` ${
                  category._id === selectedCategory._id ? ' !bg-[#616161] ' : ' bg-[black] '
                } faq-card`}
                onClick={() => {
                  setSelectedCategory(category);
                }}
              >
                <div className='faq-img'>
                  {' '}
                  <img src={category?.image} alt='FAQIcons' id='FAQIcons' />
                </div>
                <div className='faq-card-header'>{category?.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="my-12 text-3xl font-['Hauora'] font-semibold text-white w-full px-32 card-faq-heading">
        {selectedCategory?.name}
      </div> */}

        <div className='card-grid-section faq-card-wapper'>
          {questions?.map((data, index) => {
            return (
              <div
                className={`faq-card-it ${isTabMobile ? 'mobile-faq-container' : ''}`}
                key={index}
              >
                <div
                  id={`QRoot-${index}`}
                  className={`accordion-item ${
                    !isTabMobile || activeIndex === index ? 'active' : ''
                  }`}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className='ques-f'>
                    <div className='ques-txt'>{data?.question}</div>
                    <img
                      src='../images/down-arrow.svg'
                      alt='Vector'
                      className={`arrow-icon ${activeIndex === index ? 'expanded' : ''}`}
                    />
                    <img
                      src='../images/chevron-up.svg' // Replace with your down arrow icon URL
                      alt='Down Arrow'
                      className={`down-arrow-icon ${activeIndex === index ? 'collapsed' : ''}`}
                    />
                  </div>

                  {/* {(!isTabMobile || activeIndex === index) && <svg className="faq-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="2"
                  viewBox="0 0 320 2"
                  fill="none"
                >
                  <path d="M0 1H334" stroke="#4D4D4D" />
                </svg>} */}
                  {(!isTabMobile || activeIndex === index) && <hr className='divider' />}

                  <div
                    className={`ans-txt ${!isTabMobile || activeIndex === index ? 'show' : ''}`}
                    dangerouslySetInnerHTML={{ __html: data?.answer }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        <span className='bottom-trademark'>©2023 Black Jet Mobility Pty Ltd</span>
      </div>
    </FramerMotion>
  );
};

export default Faq;
