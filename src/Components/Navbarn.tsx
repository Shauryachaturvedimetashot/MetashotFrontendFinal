import React,{useState} from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown,faUser,faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import styles from './Sidebar.module.css';

interface NavbarProps {
    company: string;
    user_name: string;
  }
const Navbar:React.FC<NavbarProps>=(props)=>{
  const [DropdownOpen,setDropdownOpen] = useState(false)
  const toggledown = ()=>{
    setDropdownOpen(!DropdownOpen)
  }

    return (
      <nav className={`bg-white shadow-2xl py-4 px-6 flex justify-between items-center navbar ${styles['navbar']}`}>
        <div className="text-1xl font-bold ml-6">
          <Link href="/">MetaShot</Link>
        </div>
        <div className="flex items-center space-x-10 navcolor">
          <span className="text-gray-700 mr-8 " ></span>
        
          
            
            {/* <button className="dropbtn">
              <div className="dropdown-content">
                <a href="#">Link1</a>
                <a href="#">Link2</a>
                <a href="#">Link3</a>
              </div>
            </button> */}
            {/* {DropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-red border border-gray-200 rounded shadow-lg z-50">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Link1</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Link2</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Link3</a>
              </div>
            )} */}
            
          <div>
          {props.company}
          </div>
          
          <div className="ml-8 cursor-pointer px-2 mr-2">
          <FontAwesomeIcon icon={faRightFromBracket} className="fas fa-check" style={{ color: "black" }}/>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;