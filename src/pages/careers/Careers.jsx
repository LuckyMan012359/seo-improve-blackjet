import { Entermobilegetapp } from 'components/Popup';
import DesktopOnlyPage from 'components/desktopOnlyPage/DesktopOnlyPage';
import  { CommonSelectV2 } from 'components/formcomponents/CommonSelect';
import  { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCareers, getJobDetails } from 'services/api';
import CareerHeader from './CareerHeader';
import CustomChip from 'components/ui/CustomChip';

/**
 * Page for showing all the available job positions
 * @returns {ReactElement} The component for the careers page
 */
const Careers = () => {
  const [careerList, setCareerList] = useState([]);
  const [totalJob, setTotalJob] = useState();

  const [jobsFilterList, setJobsFilterList] = useState(null);
  const [filter, setFilter] = useState({
    job_type: '',
    job_location: '',
    job_category: '',
  });

  const getJob = async (filter) => {
    const findById = (arr, id) => {
      return arr.find((ele) => ele._id === id)?.name;
    };
    try {
      let payload = {
        // skip: 1,
        // limit: 10,
        job_type: findById(jobsFilterList?.job_types || [], filter?.job_type),
        job_location: findById(jobsFilterList?.job_locations || [], filter?.job_location),
        category: findById(jobsFilterList?.job_categories || [], filter?.job_category),
      };

      const res = await getCareers(payload);
      setTotalJob(res?.data?.totalItems);
      console.log(res.data);
      setCareerList(res?.data?.data);
      // setSelectedId(res?.data?.data[0]._id || {});
    } catch (error) {
      console.log(error, 'error__');
    }
  };

  const apiGetJobDetail = async () => {
    try {
      const getJobDetailRes = await getJobDetails();
      if (getJobDetailRes?.data?.status_code === 200) {
        setJobsFilterList(getJobDetailRes?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(() => {
    getJob(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    apiGetJobDetail();
  }, []);

  if (!jobsFilterList) {
    return <>Loading...</>;
  }

  return (
    <>
      <Entermobilegetapp />
      <div className='desktop-careers'>
        <CareerHeader />

        <div className='new-opprtu'>
          <div className='new-opprtu-wrap'>
            <div className='new-heading'>New opportunities</div>
            <div className='job-select-dropdown'>
              <CommonSelectV2
                value={filter.job_category}
                // onChange={handleSelectChange}
                placeholder='Category'
                options={jobsFilterList?.job_categories?.map((category) => ({
                  value: category?._id,
                  label: category?.name,
                }))}
                name='job_category'
                setValue={(name, value) => {
                  setFilter((prev) => ({ ...prev, [name]: value }));
                  console.log(value);
                }}
              />

              <CommonSelectV2
                value={filter.job_type}
                // onChange={handleSelectChange}
                placeholder='Job Type'
                options={jobsFilterList?.job_types?.map((jobType) => ({
                  value: jobType?._id,
                  label: jobType?.name,
                }))}
                name='job_type'
                setValue={(name, value) => {
                  setFilter((prev) => ({ ...prev, [name]: value }));
                  console.log(value);
                }}
              />

              <CommonSelectV2
                value={filter.job_location}
                // onChange={handleSelectChange}
                placeholder='Location'
                options={jobsFilterList?.job_locations?.map((location) => ({
                  value: location?._id,
                  label: location?.name,
                }))}
                name='job_location'
                setValue={(name, value) => {
                  setFilter((prev) => ({ ...prev, [name]: value }));
                }}
              />
            </div>

            {totalJob && (
              <div className='job-count-text'>
                {totalJob} Jobs in all categories in all job types
              </div>
            )}
            {!totalJob && <div className='job-count-text'>No Jobs Available</div>}
          </div>
          <div className='job-selection-wrap'>
            <CareerCard careerList={careerList} />
          </div>
        </div>
      </div>
      <DesktopOnlyPage heading='Careers' />
    </>
  );
};

export default Careers;

const CareerCard = ({ careerList }) => {
  if (!careerList) {
    return <>Loading...</>;
  }
  if (careerList?.length === 0) {
    return <div className='flex flex-col gap-3 w-full items-start'></div>;
  }
  console.log(careerList, 'careerList');

  return (
    <>
      {careerList?.map((career) => {
        return (
          <Link className='decoration-none' to={`/job/${career._id}`}>
            <div className='job-card'>
              <div className='job-card-info'>
                <div className='job-name'>{career?.job_name}</div>
                <p className='job-description'>
                  <div
                    className='job-title-info-description'
                    dangerouslySetInnerHTML={{ __html: career?.job_description }}
                  ></div>
                </p>
                <div className='job-card-type'>
                  <CustomChip label={career?.job_category} />
                </div>
              </div>
              <address className='job-card-location'>{career?.job_location}</address>
            </div>
          </Link>
        );
      })}
    </>
  );
};

// {/* <div className="job-type-wrap ">
//   <Link className='decoration-none' to={`/job-page/${career._id}`}>
//     <div className='flex flex-col gap-3 w-full items-start'>
//       <div className='flex flex-row justify-between w-full items-start'>
//         <div className='text-xl font-semibold text-white-A700'>{career?.job_name}</div>
//         <div className='text-xs text-white-A700 mt-1'>{career?.job_type}</div>
//       </div>
//       <div className='flex flex-row justify-between w-full items-start'>
//         <div className='font-medium text-[#bfbfbf] mt-3 w-5/6'>
//           {career?.description}
//         </div>
//         <div className='text-xs text-white-A700'>{career?.job_location}</div>
//       </div>
//     </div>
//     <div className='support-wrap flex flex-row gap-4 w-[56%] items-center mt-5 pb-3'>
//       <div className='support-text-chip text-xs text-[#141414] bg-white-A700 flex flex-row justify-center p-2 w-1/2 rounded-[32px]'>
//         Support & Opperations
//       </div>
//       <div className='support-text-chip text-xs text-white-A700 border-solid border-white-A700 flex flex-row w-1/2 justify-center  p-2 border rounded-[32px]'>
//         BUSINESS DEVELOPMENT
//       </div>
//     </div>
//   </Link>
// </div> */}
