import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faInbox, faEnvelope, faCalendar, faHandshake, faGear } from "@fortawesome/free-solid-svg-icons";
import styles from './Sidebar.module.css';

const Sidebarn: React.FC = () => {
  return (
    <div className={`w-1/5 h-3/4 ${styles['container']}`}>
      <div className='flex flex-col'>
        <div className='flex flex-col py-10 items-start sidebarN'>
          <Link href="/Jobs">
            <button className={`py-4 pl-12 btnN rounded-r-[16px] mb-2 hover:text-lg ${styles['sidebar-button']} ${styles['btnN']}`}>
              <FontAwesomeIcon icon={faHouse} className="fas fa-check mr-5" style={{ color: "black" }} />Dashboard
            </button>
          </Link>
          <Link href="/InterviewForm">
            <button className={`py-4 pl-12 btnN rounded-r-[16px] mb-2 hover:text-lg ${styles['sidebar-button']} ${styles['btnN']}`}>
              <FontAwesomeIcon icon={faInbox} className="fas fa-check mr-5" style={{ color: "black" }} />Hiring
            </button>
          </Link>
          <Link href="/PastInterviews">
            <button className={`py-4 pl-12 btnN rounded-r-[16px] mb-2 hover:text-lg ${styles['sidebar-button']} ${styles['btnN']}`}>
              <FontAwesomeIcon icon={faHandshake} className="fas fa-check mr-5" style={{ color: "black" }} />Jobs
            </button>
          </Link>
          {/* <Link href="/messages">
            <button className={`py-4 pl-12 btnN rounded-r-[16px] mb-2 hover:text-lg ${styles['sidebar-button']} ${styles['btnN']}`}>
              <FontAwesomeIcon icon={faEnvelope} className="fas fa-check mr-5" style={{ color: "black" }} />Messages
            </button>
          </Link> */}
          <Link href="/Settings">
            <button className={`py-4 pl-12 btnN rounded-r-[16px] mb-2 hover:text-lg ${styles['sidebar-button']} ${styles['btnN']}`}>
              <FontAwesomeIcon icon={faGear} className="fas fa-check mr-5" style={{ color: "black" }} />Settings
            </button>
          </Link>
        </div>
        
      </div>
    </div>
  );
}

export default Sidebarn;
