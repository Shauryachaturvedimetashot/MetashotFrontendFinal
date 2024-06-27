import React, { useEffect } from 'react'
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse,faInbox,faCalendar,faHandshake,faGear,faBolt} from "@fortawesome/free-solid-svg-icons";
const Sidebarn:React.FC=()=> {
  useEffect(()=>{
    const handleFontAwesomeLoaded = ()=>{
      document.querySelectorAll('.icon-hidden').forEach((el)=>{
        el.classList.remove('icon-hidden')
      })

    }
    const fastyles = document.querySelector('link[href*="fontawesome"]')
    if(fastyles){
      fastyles.addEventListener('load',handleFontAwesomeLoaded)
    }
    else{
      handleFontAwesomeLoaded()
    }
  },[])




  return (
   <>
   <div className='w-20p'>
   <div className='flex flex-col '>
   <div className='flex flex-col py-10 items-start sidebarN '>
   <button className='py-4 pl-12 btnN rounded-r-[16px] mb-2 hover:text-lg'>
   <Link href="/dashboard" className='href'/>
   <FontAwesomeIcon icon={faHouse} className="fas fa-check mr-5 icon-hidden" style={{ color: "black" }} />Dashboard</button>
    <button className='py-4 pl-12 btnN rounded-r-[16px] mb-2 hover:text-lg'>
    <Link href="/dashboard" className='href'/>
    <FontAwesomeIcon icon={faInbox} className="fas fa-check mr-5 icon-hidden" style={{ color: "black" }} />Hiring</button>
    <button className='py-4 pl-12 btnN rounded-r-[16px] mb-2 hover:text-lg'>
    <Link href="/dashboard"  className='href'/>
    <FontAwesomeIcon icon={faHandshake} className="fas fa-check mr-5 icon-hidden" style={{ color: "black" }} />Jobs</button>
    <button className='py-4 pl-12 btnN rounded-r-[16px] mb-2 hover:text-lg'>
    <Link href="/dashboard" className='href'/>
    <FontAwesomeIcon icon={faBolt} className="fas fa-check mr-5 icon-hidden" style={{ color: "black" }} />Messages</button>
    <button className='py-4 pl-12 btnN rounded-r-[16px] mb-2 hover:text-lg'>
    <Link href="/dashboard" className='href'/>
    <FontAwesomeIcon icon={faCalendar} className="fas fa-check mr-5 icon-hidden" style={{ color: "black" }} />Calendar</button>
    </div>
    <div className='py-40 px-7 sidebarN cursor-pointer'>
        <Link href="/dashboard" className='href' />
    <FontAwesomeIcon icon={faGear} className="fas fa-check mr-5 icon-hidden" style={{ color: "black" }} />Settings</div>

   </div>
   </div>
   </>
  )
}

export default Sidebarn
