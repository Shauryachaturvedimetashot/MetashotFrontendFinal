"use client"
import Navbar from '@/src/Components/Navbarn'
import Sidebarn from '@/src/Components/SidebarN'
import React from 'react'
import Candidate_screen from './Candidate_screen'

const Invite = () => {
  return (
    <div>
        
      <Navbar user_name="Iman" company="XYZ Company"/>
      <div className='flex h-screen'>
        <Sidebarn/>
        <Candidate_screen/>
        
      </div>
    </div>
  )
}

export default Invite
