'use client'
import React,{useReducer, useRef} from "react";
import Navbar from "./Navbar";
import Content1 from "./Content1";
import Content2 from "./Content2";
import ContactUs from "./ContactUs";
import Team from "./Team";

const Hpage:React.FC = ()=>{
    const contactRef = useRef<HTMLDivElement>(null)
    const handleBookDemoClick = () =>{
        if(contactRef.current){
            contactRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }

    return(
        <div className="bg-white">
            <Navbar onGetInTouch={handleBookDemoClick}/>
            <Content1 onBookDemoClick={handleBookDemoClick}/>
            <Content2/>
            <Team/>
            <div ref={contactRef}>
            <ContactUs/>

            </div>
            
        </div>
    )

}

export default Hpage