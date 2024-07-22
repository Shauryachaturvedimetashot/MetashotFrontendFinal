import React,{useState} from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSmile} from "@fortawesome/free-solid-svg-icons";
import apiClient from "@/src/utils/axiosSetup";

const ContactUs:React.FC = ()=>{
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);


    try{
      const response = await apiClient.post('/user/contact', { name, email, message })
      setSuccessMessage("Your message has been sent successfully!");
      setName("");
      setEmail("");
      setMessage("")
    }
    catch(err:any){
      setErrorMessage("An error occurred while sending your message. Please try again.")
    }
    finally{
      setIsSubmitting(false)
    }

  }



    
    return(
<div className=" bg-white font-spaceGrotesk  text-black pt-12 pb-14" >
        <div className="flex flex-row justify-start">
        <h1 className="ml-[10%] text-4xl bg-white font-bold">
            Contact Us

            </h1>
            <div className="lg:w-[25%] xl:w-[20%] ml-[2%]">
            Connect with us: Let&apos;s Discuss Your Interview Needs

            </div>

        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-center mt-1p mb:mt-3p">

            
        <div className="w-[80%] h-[75%] bg-[#EAFBEE] rounded-xl text-black">
        <div className="flex flex-row justify-between ml-[7%]">

            
        <div className="flex flex-col mb-4 text-lg mt-[5%] w-1/2">
            <div className="font-[600] text-xl">
           Don't be shy , say hi!!!
           <span>
           <FontAwesomeIcon icon={faSmile} className="fas fa-check mr-5 ml-1" style={{ color:"black" }} />
           </span>
                
            </div>
           
           <div>
           <form className="mt-3p">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm text-gray-700">Name*</label>
            <input type="text" id="name" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Name" required onChange={(e)=>setName(e.target.value)}/>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm text-gray-700">Email*</label>
            <input type="email" id="email" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Email" required onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block mb-2 text-sm text-gray-700">Message*</label>
            <textarea id="message" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Message" rows={4} onChange={(e) => setMessage(e.target.value)} required></textarea>
          </div>
          <button
                    type="submit"
                    className="w-full bg-green-700 text-white p-2 rounded-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
        </form>
        {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
        {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
           </div>
         </div>
        

         <div className="flex items-center ">
         <Image src="/Illustration3.png" alt="Illustration3" width={200} height={191} className="object-contain" />

         </div>
         </div>


           
        </div>

        </div>
        

    </div>


)

}

export default ContactUs