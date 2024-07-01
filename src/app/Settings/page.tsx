"use client"
import Navbar from '@/src/Components/Navbarn'
import Sidebarn from '@/src/Components/SidebarN'
import React,{useState} from "react"

import Settings_content from './settings'


const Setting=()=>{
    return(
        <>
        <Navbar user_name="Raees" company="XYZ Company"/>
        <div className='flex'>
        <Sidebarn/>
        <Settings_content/>
        
      </div>
        
        </>
    )
}
export default Setting