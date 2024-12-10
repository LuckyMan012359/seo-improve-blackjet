import React from "react";

/**
 * WhyMemberCards component
 *
 * This component renders a section on the home page with a bunch of cards
 * explaining why you should be a member of Black Jet.
 *
 * Each card has a background image, a header, and a paragraph of text. The
 * background image is a gradient that changes color as the user moves the mouse
 * over the card. The header is a heading element (h1) with some text, and the
 * paragraph is a paragraph element (p) with some text.
 *
 * The component uses the onMouseMove and onMouseLeave events to change the
 * background color of the card as the user moves the mouse over it.
 *
 * The component also uses the useState hook to keep track of the current
 * background color of each card.
 *
 * The component renders a div with the class "why-member-main", which contains a
 * heading element (h1) with the text "Why be a member?", and a div with the class
 * "home-card-grid", which contains all the cards.
 *
 * Each card is rendered as a div with the class "homeCard", which contains a div
 * with the class "home-inner", which contains the background image, header, and
 * paragraph of text.
 *
 * The component uses the style attribute to set the background color of each
 * card based on the current state of the component.
 *
 * The component also uses the onMouseMove and onMouseLeave events to change the
 * background color of the card as the user moves the mouse over it.
 *
 * The component renders a total of 9 cards, each with a different background
 * image, header, and paragraph of text.
 *
 * The component is exported as a default export from the module.
 *
 * @return {JSX.Element} The rendered component.
 */
const WhyMemberCards = () => {



/**
 * handleMouseLeave event handler
 *
 * This function is called when the user's mouse leaves a card in the "Why be a
 * member?" section of the home page. It prevents the default behavior of the
 * event, stops the event from propagating, and removes the "--mouse-x" and
 * "--mouse-y" properties from the target element's style.
 *
 * @param {Event} e The event object
 */
  const handleMouseLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.style.removeProperty("--mouse-x");
    e.target.style.removeProperty("--mouse-y");
  };



  /**
   * handleMouseMove event handler
   *
   * This function is called when the user's mouse moves over a card in the "Why
   * be a member?" section of the home page. It prevents the default behavior of
   * the event, stops the event from propagating, and sets the "--mouse-x" and
   * "--mouse-y" properties of the target element to the position of the mouse
   * relative to the element.
   *
   * @param {Event} e The event object
   */
  const handleMouseMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.target.style.setProperty("--mouse-x", `${x}px`);
    e.target.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div>
      <div className="why-member-main">
        <h1>Why be a member?</h1>

        <div id="homeCards" className="home-card-grid">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="homeCard"
          >
            <div className="home-inner">
              <img src="/images/img_favorite_white_a700.svg" alt="favorite" />
              <h1 className="homeCardHeader">Unlimited flights</h1>
            </div>
            <p className="homeCardDesc">
              Enjoy unlimited flights with a fixed monthly fee. Absolutely no
              hidden charges, no surprises.
            </p>
          </div>
          <div
            className="homeCard"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-inner">
              <img src="/images/img_user.svg" alt="user" />
              <h1 className="homeCardHeader">
                Arrive 15 minutes before departure
              </h1>
            </div>
            <p
              // className=""
              className="homeCardDesc"
            >
              Arrive a mere 15 minutes before departure at our exclusive private
              terminal — say goodbye to busy terminals and lengthy lines.
            </p>
          </div>
          <div
            className="homeCard"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-inner">
              <img src="/images/img_settings.svg" alt="settings" />
              <h1 className="homeCardHeader">Private terminal lounges</h1>
            </div>
            <p className="homeCardDesc">
              Travel in style from our private terminal lounges. Indulge in a
              selection of carefully chosen healthy snacks and beverages for a
              refined experience.
            </p>
          </div>
          <div
            className="homeCard commit"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-inner">
              <img
                src="/images/img_television_white_a700.svg"
                alt="television"
              />
              <h1 className="homeCardHeader">
                No commitment, cancel anytime
              </h1>
            </div>
            <p className="homeCardDesc">
              Benefit from our membership's monthly payments and auto-renewal.
              Cancel anytime to stop auto-renewal if unsatisfied—no lock-in
              contracts, no risk.
            </p>
          </div>
          <div
            className="homeCard stress"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-inner">
              <img src="/images/img_close.svg" alt="close" />
              <h1 className="homeCardHeader">
                Stress-free <span>and</span> hassle-free
              </h1>
            </div>
            <p className="homeCardDesc">
              Enjoy serene departures and arrivals from our private terminal,
              where our hostess greets you by name without complex check-ins or
              boarding. Seamless, comfortable, and convenient travel tailored to
              you.
            </p>
          </div>
          <div
            className="homeCard health"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-inner">
              <img
                src="/images/img_favorite_white_a700_48x44.svg"
                alt="favorite"
              />
              <h1 className="homeCardHeader">Health <span>and</span> safety</h1>
            </div>
            <p className="homeCardDesc">
              You fly with a maximum of 7 other passengers. With less contact
              points and reduced stress, our travel experience grants you more
              time for relaxation. Arrive healthier, rejuvenated, and ready to
              focus on what's truly important.
            </p>
          </div>
          <div
            className="homeCard"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-inner">
              <img src="/images/img_whybeamember.svg" alt="whybeamember" />
              <h1 className="homeCardHeader">Flexibility</h1>
            </div>
            <p className="homeCardDesc">
              Instantly book your flight at any moment, with the freedom to
              cancel without penalty up to 24 hours before takeoff. The era of
              travel tailored to your preferences is here.
            </p>
          </div>
          <div
            className="homeCard"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-inner">
              <img src="/images/img_search.svg" alt="search" />
              <h1 className="homeCardHeader">Community <span>and</span> networking</h1>
            </div>
            <p className="homeCardDesc">
              Join a community of discerning Black Jet members, fostering
              meaningful connections both in the skies and on the ground.
            </p>
          </div>
          <div
            className="homeCard guest"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-inner">
              <img src="/images/img_close_white_a700.svg" alt="close" />
              <h1 className="homeCardHeader">Guest Passes</h1>
            </div>
            <p className="homeCardDesc">
              With a Black Jet membership, every three months a complementary
              Guest Pass is reserved for you, letting you introduce a chosen one
              to fly with you on a flight. With an active Black Jet membership,
              your yet-to-be-used Guest Passes never expire.
            </p>
          </div>
          <div
            className="homeCard private-jet"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-inner">
              <img src="/images/private-m.svg" alt="thumbsup" />
              <h1 className="homeCardHeader">
                Private jet <span>travel experience</span> within your reach
              </h1>
            </div>
            <p className="homeCardDesc">
              Gone are the days when private jet travel was reserved for the
              ultra-wealthy and corporate tycoons. Our innovative approach makes
              flying private accessible for those who value their time and peace
              of mind.
            </p>
          </div>
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="home-last-div homeCard"
          >
            <div className="home-inner">
              <img
                className="h-[39px] 4k:h-[70px] 4k:w-[72px] lg:w-[34px] lg:h-[34px] w-10"
                src="/images/img_thumbsup_white_a700.svg"
                alt="thumbsup"
              />
              <h1 className="homeCardHeader">
                No drawn-out boarding procedures, no security lines, no
                loudspeakers
              </h1>
            </div>
            <p className="homeCardDesc">
              Arrive and board your aircraft in minutes with Black Jet,
              bypassing security checks, check-in lines, or long walks to the
              gate. Our members-only flights ensure everyone's identity is
              pre-verified, streamlining your travel experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyMemberCards;
