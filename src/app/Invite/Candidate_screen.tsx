import React,{useState,useEffect} from 'react'
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown,faCalendar,faGlobe,faHourglassStart,faHourglassEnd} from "@fortawesome/free-solid-svg-icons";
import Modal from '../../Components/Modal';

function Candidate_screen() {

  interface Candidate{
    name:string;
    mail:string;
    number:string;
  }

  interface FormErrors{
    name:string;
    mail:string;
    number:string;
  }

  const [startDate,setStartDate] = useState<Date|null>(new Date())
  const [endDate,setEndDate]=useState<Date|null>(new Date())
  const [startTime,setStartTime]=useState<Date|null>(new Date())
  const [endTime,setEndTime]=useState<Date|null>(new Date())
  const [error,setError] = useState<string>("")
// Modal for ADD candidate
  const[showModal,setShowModal] = useState<boolean>(false) 

  // Modal for Custom Message
  const[showModal2,setShowModal2]=useState<boolean>(false)
  const[toggleOn,setToggleOn] = useState<boolean>(false)

  // Adding hooks for deleting / edting candidates
  const [candidateName, setCandidateName] = useState<string>('');
  const [candidateMail, setCandidateMail] = useState<string>('');
  const [candidateNumber, setCandidateNumber] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number| null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({ name: '', mail: '', number: '' });

const handleToggleChange =()=>{
  if(!toggleOn){
    setShowModal2(true)
    setToggleOn(true)
  }
  else{
    setToggleOn(false)
  }
}
const handleModalClose=()=>{
  setShowModal2(false)
  setToggleOn(false)
}

  const validateDates = () => {
  if(startDate && endDate && endTime && startTime )
    {
    if (endDate < startDate || (endDate.getTime() === startDate.getTime() && endTime < startTime)) {
      setError("End date/time must be later than start date/time");
    } else {
      setError("");
    }
  }}
  
  const validateForm = ():boolean=>{
    const errors = {name:'',mail:'',number:''}
    if(!candidateName) errors.name='Required'
    if (!candidateMail) errors.mail = 'Required'
    if (!candidateNumber) errors.number = 'Required'
    setFormErrors(errors)
    return !errors.name && !errors.mail && !errors.number
  }

  const handleAddCandidate = ():void=>{
    if (validateForm()){
      const newCandidate:Candidate = {name: candidateName,mail:candidateMail,number:candidateNumber}
      if(isEditing){
        const updatedCandidates = candidates.map((c,index)=>(index===editIndex?newCandidate : c))
        setCandidates(updatedCandidates)
        setIsEditing(false)
        setEditIndex(null)
      }
      else{
        setCandidates([...candidates,newCandidate])
      }
      setCandidateName('')
      setCandidateMail('')
      setCandidateNumber('')
      // setShowModal(false)

    }
  }

  const handleEditCandidate=(index:number):void=>{
    const candidate = candidates[index]
    setCandidateName(candidate.name)
    setCandidateMail(candidate.mail)
    setCandidateNumber(candidate.number)
    setIsEditing(true)
    setEditIndex(index)
    setShowModal(true)
  }

  const handleDeleteCandidate = (index:number):void=>{
    setCandidates(candidates.filter((_,i)=>i!==index))


  }

  useEffect(()=>{
    validateDates();
  },[startDate, endDate, startTime, endTime])



  return (
<>
    <div className='content'>
    <div className='flex flex-row justify-between mt-6 md:col-span-1'>
        <button className='w-48 rounded-md bg-inherit invite_cand'> <FontAwesomeIcon icon={faCalendar} className="fas fa-check mr-2" style={{ color: "black" }} /> <select id="type" className='invite_cand'>
            <option value="invoice">Personal Calendar</option>
            <option value="payment">Public Calendar</option>
          </select></button>
        <button className='w-48 rounded-md mr-72 invite_cand'> <FontAwesomeIcon icon={faGlobe} className="fas fa-check mr-2" style={{ color: "black" }} /><select id="type" className='invite_cand'>
            <option value="invoice">Public</option>
            <option value="payment">Private</option>
          </select> </button>
    </div>
    <div className='text-5xl mt-4 font-semibold'> Interview Name</div>
    <div className='flex flex-row '>
    <div className='mt-8 max-w-2xl invite_cand h-24 rounded-md pr-2 pt-2'>
{/* For first row */}
    <div className='flex flex-row flex-grow'> 
      <div className='px-4 mr-10'>
      <FontAwesomeIcon icon={faHourglassStart} className="fas fa-check mr-2" style={{ color: "black" }} />
      Start
      </div>
      <div className='px-10'>
<DatePicker selected={startDate} dateFormat={"EEE/d-MMM"} onChange={(date)=>setStartDate(date)} className='text-center rounded-md invite_time'/>
      </div>
      <div>
<DatePicker selected={startTime} onChange={(date)=>setStartTime(date)} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" className='text-center rounded-md invite_time'/>
      </div>

    </div>
    {/* Second row */}
    <div className='flex flex-row mt-5 flex-grow'>
<div className='px-4 mr-10'>
<FontAwesomeIcon icon={faHourglassEnd} className="fas fa-check mr-2" style={{ color: "black" }} />
Stop
</div>
<div className='px-10'>
<DatePicker selected={endDate} dateFormat={"EEE/d-MMM"} onChange={(date)=>setEndDate(date)} className='text-center rounded-md invite_time'/>
</div>
<div>
<DatePicker selected={endTime} onChange={(date)=>setEndTime(date)} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" className='text-center rounded-md invite_time'/>
</div>
    </div>
    {error && <div className='text-red-500 mt-4'>{error}</div>}
    </div>
    <div className='h-24 bg-slate-300 ml-10 mt-8 w-44 rounded-md px-2 pt-3 invite_cand'>
    <FontAwesomeIcon icon={faGlobe} className="fas fa-check mr-2" style={{ color: "black" }} /> 
    <div>
      GMT+05:30
    </div>
    <div>
      Calcutta
    </div>
    </div>
    
    </div>
    
    <div className='flex flex-col px-8 '>
      <button className='max-w-md h-14 invite_cand mt-10 round rounded-md invitebtn btn_font hover:text-lg' onClick={()=>{
        setShowModal(true)
      }}>
        Add candidates
      </button>
      <div className='w-72'>
        
<label className="inline-flex items-center cursor-pointer custom invite_cand mt-3 round h-14 custom rounded-md pl-36 invitebtn">
  <input type="checkbox" value="" className="sr-only peer " onChange={handleToggleChange} checked={toggleOn}/>
  
  <span className="ms-3 text-gray-900 dark:text-gray-300 text-center btn_font hover:text-lg hover:text-white"> Custom Message </span>
  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ml-20"></div>
</label>

      </div>
      <button className='max-w-md invite_cand mt-3 rounded-md h-14 invitebtn btn_font hover:text-lg'>
Review Job Description
      </button>
    

    </div>

    <div className='py-4 mt-16 ml-8 '>
      <button className=' w-full max-w-[700px] h-10 rounded-md invite_create_btn text-white font-semibold hover:text-lg hover:bg-opacity-70'>
      Create Event
      </button>
      
    </div>
      
    </div>
    
    <Modal isVisible={showModal} onClose={()=>{
      setShowModal(false)
    }} isCustomMsg={false}>
      <div className='bg-custom-bg2 rounded-xl'>
      <h2 className='text-left text-4xl font-bold pl-4 pt-4'> Add Candidate</h2>
      <div className='flex flex-row'>
      <div className="w-full max-w-xs">
  <form className="bg-custom-bg2  rounded px-4 pt-2 pb-8 mb-2">
    <div className="mb-2 mt-2">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
        Candidate Name
      </label>
      <input className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" value={candidateName} onChange={(e)=>setCandidateName(e.target.value)} />
      {formErrors.name && <p className="text-red-500 text-xs italic">{formErrors.name}</p>}
    </div>
    <div className="mb-2">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mail">
        Candidate Mail
      </label>
      <input className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" value={candidateMail} onChange={(e) => setCandidateMail(e.target.value)}/>
      {formErrors.mail && <p className="text-red-500 text-xs italic">{formErrors.mail}</p>}
    </div>
    <div className="mb-2">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone" >
        Candidate Number
      </label>
      <input className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" value={candidateNumber} onChange={(e) => setCandidateNumber(e.target.value)} />
      {formErrors.number && <p className="text-red-500 text-xs italic">{formErrors.number}</p>}
    </div>
    <div className="flex items-center justify-between">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-left" type="button" onClick={handleAddCandidate}>

      {isEditing? 'Update': 'Add'}
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={()=>setShowModal(false)}>
        Submit
      </button>
    </div>
  </form>
  

  </div>
 
 <div className='max-h-60 overflow-y-auto'>
    {candidates.map((candidate,index)=>(
      <div key={index} className='flex p-2'>
        <div className='flex-1'>{candidate.name}</div>
        <div className='flex-none ml-2'>
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => handleEditCandidate(index)}
        >
          Edit
        </button>
        </div>
        <div className='flex-none'>
        <button
          className="text-red-500 hover:text-red-700 ml-2"
          onClick={() => handleDeleteCandidate(index)}
        >
          Delete
        </button>
        </div>
      </div>
      
    ))}
</div>
</div>
</div>
    </Modal>
  <Modal isVisible={showModal2} onClose={handleModalClose} isCustomMsg={true}>
    <div className='bg-custom-bg2 rounded-xl '>
    <h2 className='text-left text-2xl font-bold pl-4 pt-4'> Custom Message </h2>
    <div className="p-4 flex justify-center">
  <textarea
    className="resize-none w-[300px] h-[150px] p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-auto"
    style={{ caretColor: "white" }}
    placeholder="Type here..."
  ></textarea>
</div>

    </div>

  </Modal>
    
   </>
  )
}

export default Candidate_screen