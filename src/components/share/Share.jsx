import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon
} from "react-share";

const Share = () => {
  const shareUrl = "admin@blackjet.au"
  const title = "BlackJet"
  return (
    <div id="share-btn" className='share-items'>
          <div>
          <FacebookShareButton
            url={shareUrl}
            className="Demo__some-network__share-button"
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>

        </div>

        <div className="Demo__some-network">
          <FacebookMessengerShareButton
            url={shareUrl}
            appId="521270401588372"
            className="Demo__some-network__share-button"
          >
            <FacebookMessengerIcon size={32} round />
          </FacebookMessengerShareButton>
        </div>

        <div className="Demo__some-network">
          <TwitterShareButton
            url={shareUrl}
            title={title}
            className="Demo__some-network__share-button"
          >
            <XIcon size={32} round />
          </TwitterShareButton>
        </div>

        <div className="Demo__some-network">
          <TelegramShareButton
            url={shareUrl}
            title={title}
            className="Demo__some-network__share-button"
          >
            <TelegramIcon size={32} round />
          </TelegramShareButton>
        </div>

        <div className="Demo__some-network">
          <WhatsappShareButton
            url={shareUrl}
            title={title}
            separator=":: "
            className="Demo__some-network__share-button"
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>

        <div className="Demo__some-network">
          <LinkedinShareButton
            url={shareUrl}
            className="Demo__some-network__share-button"
          >
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>

        <div className="Demo__some-network">
          <EmailShareButton
            url={shareUrl}
            subject={title}
            body="body"
            className="Demo__some-network__share-button"
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>
        </div>
  )
}

export default Share