import React from 'react'

const NotifN:React.FC=()=> {
  return (
    <>
    <div className='w-1/6'>
      <div className='mt-10 ml-4 bg-custom-bg shadow-md'>
        <span className='recent'>Notification</span>
        <ul className='list-disc list-inside mt-4 px-3'>
          <li><span className='noti'>This is Notification 1 </span></li>
          <li><span className='noti'>This is Notification 2 </span></li>
          <li><span className='noti'>This is Notification 3 </span></li>
        </ul>
    

      </div>
      
    </div>
    </>
  )
}
export default NotifN