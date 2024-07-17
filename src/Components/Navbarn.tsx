import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import styles from './Sidebar.module.css';
import apiClient from "../utils/axiosSetup";


// interface NavbarProps {
//   company: string;
//   user_name: string;
// }



const Navbar: React.FC = () => {
  const [company, setCompany] = useState<string>('')
  const [DropdownOpen, setDropdownOpen] = useState(false);


  useEffect(()=>{
    const getUserDetails = async()=>{
      try{
        const response = await apiClient.get('/user/me');
        setCompany(response.data.name)
        
      }
      catch(err:any){
        console.log(err);
      }
    }
    getUserDetails()
  },[])
  
  const toggleDropdown = () => {
    setDropdownOpen(!DropdownOpen);
  };

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    
    // Redirect to /SignUp page
    window.location.href = '/SignUp';
  };

  return (
    <nav className={`bg-white py-4 px-6 flex justify-between items-center navbar ${styles['navbar']}`}>
      <div className="text-1xl font-bold ml-6">
        <Link href="/">MetaShot</Link>
      </div>
      <div className="flex items-center space-x-10 navcolor">
        <span className="text-gray-700 mr-8"></span>
        
        <div>{company}</div>
        
        <div className="ml-8 cursor-pointer px-2 mr-2" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} className="fas fa-check" style={{ color: "black" }}/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
