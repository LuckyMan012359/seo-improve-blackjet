import HOMEDesktopTabletLandscapeHomecontent from 'components/Home';
import { Entermobilegetapp } from 'components/Popup';
import usePwaNavigation from 'Hook/usePwaNavigation';

/**
 * The Home component.
 *
 * @returns {React.ReactElement} The Home component.
 */

const Home = () => {
  const { isPwa } = usePwaNavigation();
  return (
    <>
      {/* Get App */}
      {!isPwa && <Entermobilegetapp />}
      <div className='relative flex flex-col w-full mx-auto bg-gray-900 font-hauora sm:bg-inherit'>
        <HOMEDesktopTabletLandscapeHomecontent />
      </div>
    </>
  );
};

export default Home;
