import { Entermobilegetapp } from 'components/Popup'
import DesktopOnlyPage from 'components/desktopOnlyPage/DesktopOnlyPage'
import EnquiryForm from 'components/enquiryform/EnquiryForm'
import React from 'react'

const Invester = () => {
  return (
    <>
    <Entermobilegetapp />
    <div className="investor-main-wrap">
      <div className="bg-neutral-900 flex flex-col justify-center items-center px-16 pt-12 max-md:px-5">
        <div className="investor-heading">
          Investor Overview
        </div>
        <span className="flex w-full max-w-[1158px] !h-[75vh] px-20 onboardbg flex-col items-stretch max-md:max-w-full !mt-0">
          <div className="flex items-stretch justify-between gap-5 max-md:max-w-full max-md:flex-wrap relative">
            <img
              src="../images/invester1.png"
              className="aspect-square object-contain object-center w-[214px] overflow-hidden shrink-0 max-w-full"
              alt="invester"
            />
            <img
              src="../images/invester2.png"
              className="aspect-square object-contain object-center w-[214px] overflow-hidden shrink-0 max-w-full"
              alt="invester"
            />
          </div>

          <div className="self-center flex max-w-full items-stretch justify-center gap-80 mt-0 max-md:flex-wrap max-md:mt-0 absolute top-[90px]">
            <img
              src="../images/about3.png"
              className="aspect-square object-contain object-center w-[328px] overflow-hidden shrink-0 flex-1"
              alt="invester"
            />

          </div>
        </span>

        <div className="items-stretch flex flex-col">
          <span className="items-stretch flex justify-end gap-1.5 px-8">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/23f89a7d8105721e4ecccb4be4ff2e9f472cf9c4d159d7e6805475e8aa62b373?"
              className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
              alt="news"
            />
            <div className="rele-txt">
              Black Jet May Investor Release
            </div>
          </span>
          <span className="view-btn">
            View
          </span>
        </div>


        <div className="investor-para">
          Lorem ipsum dolor sit amet consectetur. Sit nunc sit nulla nibh eu libero
          vitae neque. Lorem suspendisse ac lobortis consectetur cras ullamcorper
          accumsan turpis. Fringilla tincidunt amet donec ornare adipiscing. Commodo
          ultrices neque eget at facilisis. Placerat mi tempus nullam id sociis.
          Quam eros faucibus at ornare neque placerat.
        </div>


      </div>






      <EnquiryForm enquirybg="investor-form">
        <div className="enquiry-heading">
          Have an enquiry?
        </div>
      </EnquiryForm>
    </div>
    <DesktopOnlyPage />
    </>
  )
}

export default Invester
