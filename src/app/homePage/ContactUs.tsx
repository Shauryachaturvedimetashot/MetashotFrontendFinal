import React from "react";
import Image from "next/image";
const ContactUs:React.FC = ()=>{
    
    return(
<div className=" bg-white font-spaceGrotesk  text-black pt-12 pb-14" >
        <div className="flex flex-row justify-start">
        <h1 className="ml-5p text-4xl bg-white font-bold">
            Contact Us

            </h1>
            <div className="lg:w-[25%] xl:w-[20%] ml-[2%]">
            Connect with us: Let&apos;s Discuss Your Digital Marketing Needs

            </div>

        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-center mt-1p mb:mt-3p">

            
        <div className="w-[80%] h-[65vh] bg-[#EAFBEE] rounded-xl text-black">
        <div className="flex flex-row justify-between">

            
        <div className="flex mb-4 items-center justify-center">
           <label className="flex items-center mr-4">
            <input type="radio" name="contact" className="mr-2" /> Say Hi
           </label>
           <label className="flex items-center">
            <input type="radio" name="contact" className="mr-2" /> Get a Quote
           </label>
         </div>

         <div className="flex items-center justify-center">
         <Image src="/Illustration3.png" alt="Illustration3" width={200} height={191} className="object-contain" />

         </div>
         </div>


           
        </div>

        </div>
        

    </div>


)

}

export default ContactUs