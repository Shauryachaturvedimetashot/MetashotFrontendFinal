import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from './Jobs.module.css';

interface CentreProps {
  company: string;
}
interface Interview {
  _id: string; // Add this property to store the interview ID
  name: string;
  candidates: number;
  from: string;
  to: string;
  status: 'Active' | 'Deactive'; // Updated to include 'Deactive'
}

const Centre: React.FC<CentreProps> = (props) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('https://metashotbackend.azurewebsites.net/interview/getAll', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      const enrichedInterviews = await Promise.all(data.map(async (interview: any) => {
        const scheduleResponse = await fetch(`https://metashotbackend.azurewebsites.net/interview/schedule?interview=${interview._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const scheduleData = await scheduleResponse.json();
        const recentSchedule = scheduleData.sort((a: any, b: any) => new Date(b.end).getTime() - new Date(a.end).getTime())[0];
        const toTime = recentSchedule ? recentSchedule.end : interview.updatedAt;

        return {
          _id: interview._id, // Store the interview ID
          name: interview.jobPosition,
          candidates: scheduleData.reduce((acc: number, schedule: any) => acc + schedule.candidates.length, 0),
          from: new Date(interview.createdAt).toLocaleDateString(),
          to: new Date(toTime).toLocaleDateString(),
          status: interview.status === 'active' ? 'Active' : 'Deactive' // Use the status field from the response
        };
      }));

      const sortedInterviews = enrichedInterviews.sort((a, b) => new Date(b.to).getTime() - new Date(a.to).getTime()).slice(0, 3);
      setInterviews(sortedInterviews);
    };

    fetchInterviews();
  }, []);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 425);
  };
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeModal = () => {
    setSelectedInterview(null);
  };

  return (
    <>
      <div className={`w-1/2 h-auto ${styles['container']}`}>
        <h1 className="text-2xl mb-4 font-[700] mt-12 ml-2" style={{ color: '#274C77' }}>
          Welcome, {props.company}
        </h1>
        <div>
          <Link href="/InterviewForm">
            <div className="mb-4 h-16 bg-[#F8F8FB] mt-8 rounded-2xl shadow-xl flex items-center pl-3 font-[800] text-2xl hover:bg-[#3d8a3c] hover:text-white transition duration-300 ease-in-out" style={{ color: '#274C77', cursor: 'pointer' }}>
              Post a job
            </div>
          </Link>
          <div className={`mb-4 bg-[#F8F8FB] h-auto pb-2 rounded-2xl shadow-lg ${styles['miniContainer']}`}>
            <div className="font-[800] text-2xl pl-3 pt-6" style={{ color: '#274C77' }}>
              Recent jobs
            </div>
            <div className="flex flex-col mt-4 ml-4 mr-4">
              <div className={`flex items-center font-[600] text-[#274C77] ${styles['headMini']}`}>
                <div className={`w-30p justify-start ${styles['nameCol']}`}>
                  Interview Name
                </div>
                <div className="justify-start w-21p">
                  No: of Candidates
                </div>
                <div className={`w-15p justify-start ${styles['fromCol']}`}>
                  From
                </div>
                <div className={`w-15p justify-start ${styles['toCol']}`}>
                  To
                </div>
                <div className={`w-16p justify-start ${styles['statusCol']}`}>
                  Status
                </div>
              </div>
              {interviews.map((interview, index) => (
                <div key={index} className={`flex items-center font-[200] text-[#274C77] mt-2 ${styles['textMini']}`}
                  onClick={() => { isMobile ? setSelectedInterview(interview) : undefined }}>
                  <div className={`w-30p justify-start hover:font-[500] ${styles['nameCol']}`}>
                    <Link href={`/Candidates?interview=${interview._id}`}>
                      {interview.name}
                    </Link>
                  </div>
                  <div className="text-center w-21p">
                    {interview.candidates}
                  </div>
                  <div className={`w-15p justify-start text-left ${styles['fromCol1']}`}>
                    {interview.from}
                  </div>
                  <div className={`w-15p justify-start ${styles['toCol1']}`}>
                    {interview.to}
                  </div>
                  <div className={`px-2 py-1 rounded-2xl ${interview.status === 'Active' ? 'bg-green-500 text-white w-17p text-center' : 'bg-red-500 text-white w-17p text-center'} ${styles['statusCol']}`}>
                    {interview.status}
                  </div>
                </div>
              ))}
            </div>

            {selectedInterview && isMobile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-11/12 max-w-md p-6 bg-white rounded-lg shadow-lg">
                  <h2 className="mb-4 text-2xl font-bold">Interview Details</h2>
                  <p><strong>Name:</strong> {selectedInterview.name}</p>
                  <p><strong>No: of Candidates:</strong> {selectedInterview.candidates}</p>
                  <p><strong>From:</strong> {selectedInterview.from}</p>
                  <p><strong>To:</strong> {selectedInterview.to}</p>
                  <p><strong>Status:</strong> {selectedInterview.status}</p>
                  <button
                    className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Centre;
