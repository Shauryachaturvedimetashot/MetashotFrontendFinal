import React, { useState,ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import Modal from '../../Components/Modal'

const Settings_content:React.FC = () => {
  const [exportCandidateList, setExportCandidateList] = useState<boolean>(false);
  const [removeListings, setRemoveListings] = useState<boolean>(false);
  const [deleteData, setDeleteData] = useState<boolean>(false);
  const [name, setName] = useState<string>('Peter Griffin');
  const [companyName, setCompanyName] = useState<string>('Peterdactyl2015');
  const [companyDetails, setCompanyDetails] = useState<string>('Peterdactyl2015');
  const [email, setEmail] = useState<string>('hello@drop.io');

  //For Popups
  const [showModal1,setShowModal1] = useState<boolean>(false)
  const [showModal2,setShowModal2] = useState<boolean>(false)
  const [showModal3,setShowModal3] = useState<boolean>(false)

  // for handling profile input

  const [fileError, setFileError] = useState<string>('');
  const [fileSelected, setFileSelected] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>)=>{
    const files = event.target.files?.[0]
    //convert bytes to mb
   if (files){
    if(files.size>1048576){       
        setFileError(' Size more than 1mb')
        setFileSelected(false)
 } 
 else{
    setFileError('')
    setFileSelected(true)
 }
   }  
   else{
    setFileError('')
    setFileSelected(false)
   }  


  }



  const handleToggle = (setter:React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(prev => !prev);
    // setShowModal1(true)
  };
  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  };

  

  return (
    <>
    <div className="flex flex-col items-center mt-8 rounded-xl text-xs shadow-md" style={{ width: '1000px', height: '610px', backgroundColor: '#F8F8FB', fontFamily: 'Inter',color:'#3C3C3C' }}>
      <div className="w-full px-6 ">
        <h2 className="text-xl font-semibold mb-8 mt-6 ml-5">Settings</h2>
        
        <div className="mb-1 flex justify-start ml-20">
          <label className="block mb-2 font-bold">Profile picture</label>
          <input type="file" className="block mb-2 ml-10" onChange={handleFileChange} />
          
        </div>
        {!fileSelected && fileError.length===0 && (
        <div className='ml-52'>
        <small className="text-gray-500">no file selected</small><br />
        <small className="text-gray-500">maximum image size is 1 MB</small>

        </div>)}
        {fileError && (
            <div className="ml-52 text-red-500">
            {fileError}
          </div>
        )}
        

        <div className="mb-4 flex justify-start items-center mt-5">
          <label className="  font-bold ml-32 text-right flex justify-center">Name</label>
          <input type="text" className="p-2 border rounded-md ml-10" style={{width:'282px'}} value={name} onChange={handleChange(setName)} />
        </div>

        <div className="mb-4 flex justify-start items-center">
          <label className="block  font-bold text-right " style={{marginLeft:"70px"}}>Company Name</label>
          <input type="text" className="p-2 border rounded-md" value={companyName} style={{width:'282px',marginLeft:'38px'}} onChange={handleChange(setCompanyName)} />
        </div>

        <div className="mb-4 flex justify-start items-center">
          <label className="block font-bold text-right ml-16">Company Details</label>
          <input type="text" className=" p-2 border rounded-md" style={{width:'282px',marginLeft:'38px'}} value={companyDetails} onChange={handleChange(setCompanyDetails)} />
        </div>

        <div className=" flex justify-start items-center">
          <label className="block font-bold text-right ml-32 ">Email</label>
          <input type="email" className="w-full p-2 border rounded-md " style={{width:'282px',marginLeft:'40px'}} value={email} onChange={handleChange(setEmail)} />
          
        </div>
        <div style={{marginLeft:'350px'}}>
        <small className="text-red-500">Email not verified. <a href="#" className="text-blue-500 underline">Verify now</a></small>
        </div>

        <div className="flex items-center mb-4">
          <span className="mr-4 font-bold text-right ml-10">Export candidate list</span>
          <FontAwesomeIcon 
            icon={exportCandidateList ? faToggleOn : faToggleOff} 
            className={`text-2xl cursor-pointer ${exportCandidateList ? 'text-green-500' : ''} ml-6`} 
            
            onClick={() => {handleToggle(setExportCandidateList)
                setShowModal1(true)
            }}
          />
        </div>

        <div className="flex items-center mb-4">
          <span className="mr-4 font-bold text-right ml-16 ">Remove listings</span>
          <FontAwesomeIcon 
            icon={removeListings ? faToggleOn : faToggleOff} 
            className={`text-2xl cursor-pointer ${removeListings ? 'text-green-500' : ''} ml-7`}
            onClick={() => {handleToggle(setRemoveListings)
                setShowModal2(true)
            }}
          />
        </div>

        <div className="flex items-center mb-4">
          <span className="mr-4 font-bold text-right" style={{marginLeft:'88px'}}>Delete Data</span>
          <FontAwesomeIcon 
            icon={deleteData ? faToggleOn : faToggleOff} 
            className={`text-2xl cursor-pointer ${deleteData ? 'text-green-500' : ''} ml-7`}
            
            onClick={() => {handleToggle(setDeleteData)
                setShowModal3(true)
            }}
          />
        </div>
        <div className='ml-52 font-bold' style={{color:'#AFAFAF'}}>
            <a href='#'>LOGOUT</a>
        </div>
        <div className='ml-52 font-bold mt-3' style={{color:'#3D8A3C'}}>
           <a href = '#'> DELETE MY ACCOUNT</a> 
        </div>

        {/* <button className="w-full py-2 mt-4 bg-red-500 text-white rounded-md">LOGOUT</button> */}

        {/* <button className="w-full py-2 mt-4 text-red-500 rounded-md">DELETE MY ACCOUNT</button> */}
      </div>
    </div>
    <Modal isVisible={showModal1} onClose={()=>{
        setShowModal1(false);
        handleToggle(setExportCandidateList)

    }
    } isCustomMsg={false} >
        <div className='bg-custom-bg2 rounded-xl h-60'>
        <h2 className='text-left text-2xl font-bold pl-4 pt-4'> Export Candidate list</h2>

        </div>

    </Modal>
    <Modal isVisible={showModal2} onClose={()=>{
        setShowModal2(false);
        handleToggle(setRemoveListings)

    }
    } isCustomMsg={false} >
        <div className='bg-custom-bg2 rounded-xl h-60'>
        <h2 className='text-left text-2xl font-bold pl-4 pt-4'> Remove Listings </h2>

        </div>

    </Modal>
    <Modal isVisible={showModal3} onClose={()=>{
        setShowModal3(false);
        handleToggle(setDeleteData)

    }
    } isCustomMsg={false} >
        <div className='bg-custom-bg2 rounded-xl h-60'>
        <h2 className='text-left text-2xl font-bold pl-4 pt-4'> Delete Data </h2>

        </div>

    </Modal>
    </>



  );
};

export default Settings_content;
