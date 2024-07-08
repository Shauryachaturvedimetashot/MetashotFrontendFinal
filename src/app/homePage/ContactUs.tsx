import React from "react";
import Image from "next/image";
const ContactUs:React.FC = ()=>{
    
    return(

    //     <div className="flex flex-col lg:flex-row items-center justify-center bg-green-50 py-16 px-4">
    //   <div className="bg-white p-8 rounded-xl shadow-md w-full lg:w-1/2">
    //     <h2 className="text-3xl font-bold mb-4 text-green-800">Contact Us</h2>
    //     <p className="text-lg mb-8 text-green-700">Connect with us: Let's Discuss Your Digital Marketing Needs</p>
    //     <div className="flex mb-4">
    //       <label className="flex items-center mr-4">
    //         <input type="radio" name="contact" className="mr-2" /> Say Hi
    //       </label>
    //       <label className="flex items-center">
    //         <input type="radio" name="contact" className="mr-2" /> Get a Quote
    //       </label>
    //     </div>
    //     <form>
    //       <div className="mb-4">
    //         <label htmlFor="name" className="block mb-2 text-sm text-gray-700">Name</label>
    //         <input type="text" id="name" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Name" />
    //       </div>
    //       <div className="mb-4">
    //         <label htmlFor="email" className="block mb-2 text-sm text-gray-700">Email*</label>
    //         <input type="email" id="email" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Email" required />
    //       </div>
    //       <div className="mb-4">
    //         <label htmlFor="message" className="block mb-2 text-sm text-gray-700">Message*</label>
    //         <textarea id="message" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Message" rows={4} required></textarea>
    //       </div>
    //       <button type="submit" className="w-full bg-green-700 text-white p-2 rounded-md">Send Message</button>
    //     </form>
    //   </div>
    //   <div className="mt-8 lg:mt-0 lg:ml-8 w-full lg:w-1/2 flex items-center justify-center">
    //   <Image src="/Illustration3.png" alt="Illustration3" width={500} height={500} className="object-contain" />
    //   </div>
    // </div>
    <div className=" bg-white font-spaceGrotesk  text-black pt-12 pb-14" >
        <div className="flex flex-row justify-start">
        <h1 className="ml-5p text-4xl bg-white font-bold">
            Contact Us

            </h1>
            <div className="lg:w-[25%] xl:w-[20%] ml-[2%]">
            Connect with us: Let's Discuss Your Digital Marketing Needs

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