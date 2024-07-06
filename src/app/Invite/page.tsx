"use client";
import React, { Suspense } from 'react';
import Navbar from '@/src/Components/Navbarn';
import Sidebarn from '@/src/Components/SidebarN';
import Candidate_screen from './Candidate_screen';

const Invite = () => {
  return (
    <div>
      <Navbar user_name="Metashot" company="Metashot" />
      <div className='flex'>
        <Sidebarn />
        <Suspense fallback={<div>Loading...</div>}>
          <Candidate_screen />
        </Suspense>
      </div>
    </div>
  );
};

export default Invite;
