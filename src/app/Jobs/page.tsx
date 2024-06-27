"use client"
import Image from "next/image";
import { Inter } from "next/font/google";

// import Sidebarn from "@/src/components/SidebarN";

// import NotifN from "@/components/NotifN";
import Navbar from "@/src/Components/Navbarn";
import Sidebarn from "@/src/Components/SidebarN";
import RecentN from "./RecentN";
import NotifN from "./NotifN";

const inter = Inter({ subsets: ["latin"] });

const Home:React.FC=()=> {
  return (
    <>
    <Navbar user_name="Iman" company="XYZ Company"/>
    <div className="flex h-screen">
      <Sidebarn/>
      <RecentN/>
      <NotifN/>
    </div>
    </>
  );
}
export default Home;