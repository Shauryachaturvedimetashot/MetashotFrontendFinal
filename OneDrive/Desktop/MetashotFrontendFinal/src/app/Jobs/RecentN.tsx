import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

const RecentN: React.FC = () => {
  return (
    <>
      <div className='w-1/2'>
        <div className='mt-10 pb-4 recent shadow-md bg-custom-bg'>
          <div className='flex flex-row justify-between ml-4'>
            <div>Recent Listings</div>
            <div className='px-6 mr-4'>
              <Link href="/PastInterviews">
                See All <FontAwesomeIcon icon={faChevronRight} className="fas fa-check mr-2" style={{ color: "black" }} />
              </Link>
            </div>
          </div>
          <div className='flex flex-row justify-start ml-4'>
            <button className='h-28 recentBox rounded-xl mr-7 w-48 flex items-start pl-2 hover:text-lg'>
              JOB1
            </button>
            <button className='w-48 h-28 recentBox rounded-xl  mr-7 flex items-start pl-2 hover:text-lg'>JOB2</button>
            <button className='w-48 h-28 recentBox rounded-xl flex items-start pl-2 hover:text-lg'>JOB3</button>
          </div>
        </div> {/* 1st row box */}
        <div className='pb-4 pt-12'>
          <div className='flex flex-row justify-start recent'>
            <Link href="/InterviewForm">
              <button className='ml-6 w-72 h-36 rounded-xl mr-11 postJob bg-custom-bg shadow-md hover:text-lg'>
                Post a Job
              </button>
            </Link>
            <button className='w-72 h-36 rounded-xl postJob bg-custom-bg shadow-md'>Candidates</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentN;
