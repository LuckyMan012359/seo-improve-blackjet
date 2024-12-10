// import SplineComp from "./SplineComp";
import Adaywithblack from 'components/Adaywithblack';
import FlyFreely from 'components/NewHomeSection/FlyFreely';
import FlyPrivateSection from 'components/NewHomeSection/FlyPrivateSection';
import IconSection from 'components/NewHomeSection/IconSection';
import LaunchingFall from 'components/NewHomeSection/LaunchingFall';
import PhoneInHand from 'components/NewHomeSection/PhoneInHand';
import PrivateTerminals from 'components/NewHomeSection/PrivateTerminals';
import StillUnsure from 'components/NewHomeSection/StillUnsure';
import TourSection from 'components/NewHomeSection/TourSection';
import UnlimitedFlight from 'components/NewHomeSection/UnlimitedFlight';
import WhyMemberCards from 'components/NewHomeSection/WhyMemberCards';
import MapAnimation from 'components/Svgs';

/**
 * This component renders the home page content for desktop and tablet devices
 * in landscape orientation. It renders a sequence of sections, including a
 * "fly freely" section, a "fly freely private" section, a map animation section,
 * a "phone in hand" section, a "why be a member" section, an "unlimited flight"
 * section, a "private terminal" section, a tour section, a "launching fall"
 * section, a "still unsure" section, and an "icon" section.
 *
 * @returns {JSX.Element} The home page content for desktop and tablet devices
 * in landscape orientation.
 */
const HOMEDesktopTabletLandscapeHomecontent = () => {
  return (
    <>
      <div>
        {/*fly freely*/}
        <div>
          <FlyFreely />
        </div>
        {/*fly freely end here*/}

        {/*fly freely private*/}
        <div>
          <FlyPrivateSection />
        </div>
        {/*fly freely private end here*/}

        {/*map section*/}
        <div className='map-animation-wrap flex flex-col items-center justify-start w-full'>
          <MapAnimation className='w-full map-animations animate ' />
        </div>
        {/*map section end here*/}

        {/*Phone in hand*/}
        <div>
          <PhoneInHand />
        </div>
        {/*Phone in hand end here*/}

        {/*why be a member section*/}
        <div>
          <WhyMemberCards />
        </div>

        {/*Unlimited flight section*/}
        <div>
          <UnlimitedFlight />
        </div>

        {/*Private terminal section*/}
        <div>
          <PrivateTerminals />
        </div>
        {/*Private terminal section end here*/}

        {/*Tour Section section*/}
        <div>
          <TourSection />
        </div>
        {/*Tour Section section end here*/}

        {/*Tour Section section*/}
        <Adaywithblack />
        {/*Tour Section end section*/}

        {/*Launching fall section*/}
        <LaunchingFall />
        {/*Launching fall end section*/}

        {/*Still unsuresection*/}
        <StillUnsure />
        {/*Still unsureend section*/}

        {/*icon section*/}
        <IconSection />
        {/*icon end section*/}
      </div>
    </>
  );
};

export default HOMEDesktopTabletLandscapeHomecontent;
