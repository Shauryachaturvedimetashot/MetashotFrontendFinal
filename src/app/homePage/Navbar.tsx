import Link from "next/link";
import React from "react";
import Image from "next/image";

const Navbar:React.FC =()=>{

    return(
        <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex flex-row items-center justify-center">
            <Image src = "/metashot_logo copy.png" alt="MetaShot Logo" width={50} height={50} className="ml-[5%]" />
          <div className="text-2xl font-[600] ml-5 text-black">MetaShot</div>
          </div>
          
          <div className="text-sm flex flex-row justify-end space-x-4 md:space-x-5">
            <button className="bg-white border border-green-500 px-4 py-2 rounded-md text-black hover:bg-green-500">
              Get in touch
            </button>
            <Link href="/SignUp">
              <button className="bg-white border border-green-500 px-4 py-2 rounded-md text-black hover:bg-green-500">
                Login/SignUp
              </button>
            </Link>
          </div>
        </div>
      </nav>
    )

}

export default Navbar