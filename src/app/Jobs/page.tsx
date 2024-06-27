"use client"
import Image from "next/image";
import { Inter } from "next/font/google";

// import Sidebarn from "@/src/components/SidebarN";

// import NotifN from "@/components/NotifN";
import Navbar from "../../Components/Navbarn";
import Sidebarn from "../../Components/SidebarN";

import React from "react";
import Centre from "./Centre";

const inter = Inter({ subsets: ["latin"] });

const Home:React.FC=()=> {
  return (
    <>
    <Navbar user_name="Iman" company="XYZ Company"/>
    <div className="flex h-screen">
      <Sidebarn/>
      
      <Centre company="XYZ Company"/>
      
    </div>
    </>
  );
}
export default Home;