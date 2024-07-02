import React, {useEffect,useState} from "react";
import Link from "next/link";
import styles from './Jobs.module.css'
import { faL } from "@fortawesome/free-solid-svg-icons";

interface CentreProps {
  company: string;
}
interface Interview{
  name:string,
  candidates:number,
  from:string,
  to:string,
  status:'Active'|'Completed'
}

const Centre: React.FC<CentreProps> = (props) => {

  const [interviews,setInterviews] = useState<Interview[]>([])
  useEffect (()=>{
    const fetchInterviews = async()=>{
      const data:Interview[] = [
        { name: "Interview 1", candidates: 60, from: "2023-06-01", to: "2023-06-05", status: "Active" },
        { name: "Interview 2", candidates: 45, from: "2023-06-10", to: "2023-06-12", status: "Completed" },
        { name: "Interview 3", candidates: 30, from: "2023-06-15", to: "2023-06-18", status: "Active" },
        { name: "Interview 4", candidates: 20, from: "2023-06-15", to: "2023-06-18", status: "Active" },
        { name: "Interview 5", candidates: 70, from: "2023-06-15", to: "2023-06-18", status: "Completed" },
      ]
      setInterviews(data)
    }
    fetchInterviews()
  },[])

  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 425);
  }
  useEffect(()=>{
    handleResize(); // Check initial screen size
    window.addEventListener('resize', handleResize)
    return ()=>window.removeEventListener('resize', handleResize)
  },[])

  const closeModal = () => {
    setSelectedInterview(null);
  }


  return (
    <>
      <div className={`w-1/2 ${styles['container']}`}>
        <h1 className="text-2xl mb-4 font-[700] mt-12 ml-2" style={{  color: '#274C77' }}>
          WELCOME, Metashot
        </h1>
        <div>
          <Link href="/InterviewForm">
            <div className="mb-4 h-16 bg-[#F8F8FB] mt-8 rounded-2xl shadow-xl flex items-center pl-3 font-[800] text-2xl hover:bg-[#3d8a3c] hover:text-white transition duration-300 ease-in-out" style={{  color: '#274C77', cursor: 'pointer' }}>
              POST A JOB
            </div>
          </Link>
          <div className={`mb-4 bg-[#F8F8FB] h-auto pb-2 rounded-2xl shadow-lg mt-20 ${styles['miniContainer']}`}>
            <div className="font-[800] text-2xl pl-3 pt-6" style={{  color: '#274C77' }}>
              ALL LISTED JOBS
            </div>
            <div className="ml-4 mr-4 mt-4 flex flex-col">
              <div className={`flex items-center font-[600] text-[#274C77] ${styles['headMini']}`}>
                <div className={`w-30p justify-start ${styles['nameCol']}`}>
                  Interview Name
                </div>
                <div className="w-21p justify-start">
                  No: of Candidates
                </div>
                <div className={`w-15p  justify-start ${styles['fromCol']}`}>
                  From
                </div>
                <div className={`w-15p justify-start ${styles['toCol']}`}>
                  To
                </div>
                <div className={`w-16p justify-start ${styles['statusCol']}`}>
                  Status
                </div>
              </div>
              {/* Start adding the Interview Details below */}
              {interviews.map((interview,index)=>( 
              <div key={index} className={`flex items-center font-[200] text-[#274C77] mt-2 ${styles['textMini']}`}
              onClick={()=>{isMobile?()=>setSelectedInterview(interview):undefined}}>
                <div className={`w-30p justify-start hover:font-[500] ${styles['nameCol']}`}>
                  {interview.name}
                </div>
                <div className="w-21p text-center">
                  {interview.candidates}
                </div>
                <div className={`w-15p justify-start text-left ${styles['fromCol']}`}>
                  {interview.from}
                </div>
                <div className={`w-15p justify-start ${styles['toCol']}`}>
                  {interview.to}
                </div>
                <div className={`px-2 py-1 rounded-2xl ${interview.status==='Active'?'bg-red-500 text-white w-17p text-center' : 'bg-green-500 text-white w-17p text-center'} ${styles['statusCol']}`}>
                  {interview.status}
                </div>
              </div>

              ))}



            </div>

            {selectedInterview && isMobile && (
               <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
               <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                 <h2 className="text-2xl font-bold mb-4">Interview Details</h2>
                 <p><strong>Name:</strong> {selectedInterview.name}</p>
                 <p><strong>No: of Candidates:</strong> {selectedInterview.candidates}</p>
                 <p><strong>From:</strong> {selectedInterview.from}</p>
                 <p><strong>To:</strong> {selectedInterview.to}</p>
                 <p><strong>Status:</strong> {selectedInterview.status}</p>
                 <button
                   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
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
