import React, {useEffect,useState} from "react";
import Link from "next/link";
import styles from './Jobs.module.css'

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


  return (
    <>
      <div className={`w-1/2 ${styles['container']}`}>
        <h1 className="text-2xl mb-4 font-[700] mt-12 ml-2" style={{  color: '#274C77' }}>
          WELCOME, {props.company}
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
                <div className="w-64 justify-start">
                  Interview Name
                </div>
                <div className="w-36 justify-start">
                  No: of Candidates
                </div>
                <div className="w-28 ml-3 justify-start">
                  From
                </div>
                <div className="w-28 justify-start">
                  To
                </div>
                <div className="justify-start">
                  Status
                </div>
              </div>
              {/* Start adding the Interview Details below */}
              {interviews.map((interview,index)=>( 
              <div key={index} className={`flex items-center font-[200] text-[#274C77] mt-2 ${styles['textMini']}`}>
                <div className="w-64 justify-start hover:font-[500] ">
                  {interview.name}
                </div>
                <div className="w-36 text-center">
                  {interview.candidates}
                </div>
                <div className="w-28 ml-3 justify-start">
                  {interview.from}
                </div>
                <div className="w-28 justify-start">
                  {interview.to}
                </div>
                <div className={`px-2 py-1 rounded-2xl ${interview.status==='Active'?'bg-red-500 text-white w-24 text-center' : 'bg-green-500 text-white w-24 text-center'}`}>
                  {interview.status}
                </div>
              </div>

              ))}



            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Centre;
