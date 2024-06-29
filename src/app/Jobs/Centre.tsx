import React from "react";
import Link from "next/link";
import styles from './Jobs.module.css'

interface CentreProps {
  company: string;
}

const Centre: React.FC<CentreProps> = (props) => {
  return (
    <>
      <div className={`w-1/2 ${styles['container']}`}>
        <h1 className="text-2xl mb-4 font-black mt-12 ml-2" style={{ fontFamily: 'Lato', color: '#274C77' }}>
          WELCOME, {props.company}
        </h1>
        <div>
          <Link href="/InterviewForm">
            <div className="mb-4 h-16 bg-[#F8F8FB] mt-8 rounded-2xl shadow-xl flex items-center pl-3 font-black text-2xl hover:bg-[#3d8a3c] hover:text-white transition duration-300 ease-in-out" style={{ fontFamily: 'Lato', color: '#274C77', cursor: 'pointer' }}>
              POST A JOB
            </div>
          </Link>
          <div className="mb-4 bg-[#F8F8FB] h-80 rounded-2xl shadow-lg mt-20">
            <div className="font-black text-2xl pl-3 pt-6" style={{ fontFamily: 'Lato', color: '#274C77' }}>
              ALL LISTED JOBS
            </div>
            <div className="flex justify-evenly pt-6">
              <div className="w-36 h-52 bg-[#3D8A3C] rounded-2xl shadow-2xl">
                container 1
              </div>
              <div className="w-36 h-52 bg-[#3D8A3C] rounded-2xl shadow-2xl">
                container 2
              </div>
              <div className="w-36 h-52 bg-[#3D8A3C] rounded-2xl shadow-2xl">
                container 3
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Centre;
