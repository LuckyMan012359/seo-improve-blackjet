import React from 'react'

/**
 * A functional component that renders a news card.
 *
 * The component renders a news card containing a background image, a heading, a
 * profile image and name, a date, and a read more button.
 *
 * The component is exported as a default export from the module.
 *
 * @return {JSX.Element} The rendered component.
 */
const NewsCard = () => {
  return (
    <div>
      <div className="media-new-card">
            <img
              loading="lazy"
              srcSet="../images/new3.png"
              className="aspect-[1.03] object-contain object-center w-full overflow-hidden"
              alt="news"
            />
            <div className="card-heading-media">
              Silicon Valley Losing Ground in Washington
            </div>
            <div className="profile-img-txt">
              <img
                loading="lazy"
                srcSet="../images/new1.png"
                className="aspect-square object-contain object-center w-11 overflow-hidden shrink-0 max-w-full rounded-[50%]"
                alt="profile"
              />
              <div>
                <div className="user-name">
                  By Akash Shakya
                </div>
                <div className="user-date">
                  23 April 2023
                </div>
              </div>
            </div>
            <button className="read-btn">
              Read more
            </button>
          </div>
    </div>
  )
}

export default NewsCard
