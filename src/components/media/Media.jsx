import { Entermobilegetapp } from "components/Popup";
import DesktopOnlyPage from "components/desktopOnlyPage/DesktopOnlyPage";
import EnquiryForm from "components/enquiryform/EnquiryForm";
import NewsCard from "components/newscard/NewsCard";
import React from "react";

const Media = () => {
  return (
    <>
    <Entermobilegetapp />
    <div className="mb-28 media-desktop">
      <div className="onboardbg media-main-wrapper">
        <div>
        <div className="main-wrap">
          <div className="media-inner">
            <h1 className="main-heading-media">
              Media kit
            </h1>
            <p className="media-para">
              Lorem ipsum dolor sit amet consectetur. Sit nunc sit nulla nibh eu
              libero vitae neque. Lorem suspendisse ac lobortis consectetur cras
              ullamcorper accumsan turpis. Fringilla tincidunt amet donec ornare
              adipiscing. Commodo ultrices neque eget at facilisis. Placerat mi
              tempus nullam id sociis. Quam eros faucibus at ornare neque
              placerat.
            </p>
            <button className="get-press">
              Get Press Kit
            </button>
            <div className="check-see">
            <h2 className="check-heading">
              Checkout the latest news
            </h2>
            <button className="see-btn">
              See more
            </button>
          </div>

          <div className="media-card-wrap">
            <div className="media-card">
              <NewsCard />
            </div>
            <div className="media-card">
              <NewsCard />
            </div>
            <div className="media-card">
              <NewsCard />
            </div>
           
          </div>
          </div>

          <div>
            <EnquiryForm enquirybg="media-form" type={"media_type"}>
              <div className="enquiry-heading">
                Have an enquiry?
              </div>
            </EnquiryForm>
          </div> 

         
        </div>
        
        </div>
        
      </div>
    </div>
    <DesktopOnlyPage heading="Media/Press" />
    </>
  );
};

export default Media;
