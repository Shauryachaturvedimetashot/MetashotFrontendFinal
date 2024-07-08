import React from "react";


const Navbar:React.FC =()=>{

    return(
        <nav className="bg-white border-b border-gray-200 ">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-2xl font-[500] ml-5p text-black">MetaShot</div>
            <button className="bg-white border border-green-500  px-4 py-2 rounded-md text-black mr-5p hover:bg-green-500">Get in touch</button>

            </div>
        </nav>
    )

}

export default Navbar