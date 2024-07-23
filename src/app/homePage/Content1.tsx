import React from "react";
import Image from "next/image";

const Content1:React.FC<{onBookDemoClick:()=>void}> =({onBookDemoClick})=>{
    return(
      <>
        <main className="container mx-auto  py-16 bg-white font-spaceGrotesk">
      <div className="flex flex-wrap md:flex-nowrap justify-between">
        <div className="w-full md:w-1/2 pr-0 ml-5p md:pr-8 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4 text-black">Meet Shot - Your </h1>
          <h1 className="text-4xl font-bold mb-4 text-black">Expert Interviewer</h1>
          <p className="text-lg text-gray-700 mb-8">
            Streamline your hiring process with intelligent scheduling, interactive interviews, and comprehensive insights.
          </p>
          <button className="bg-[#3D8A3C] text-white px-6 py-3 rounded-md hover:bg-green-500" onClick={onBookDemoClick}>Book a Demo</button>
        </div>
        <div className="w-full md:w-1/2 h-1/5 flex justify-center ">
        <div className="pl-20">
        <Image src="/Illustration.jpg" alt="Illustration" width={400} height={400} layout="" className=""/>

        </div>
        
        </div>
      </div>
      <div className="mt-12 text-center  text-gray-800 text-2xl font-[600] ">
        Hiring shouldn’t be tiring, hire effortlessly with Shot
      </div>
    </main>
``

{/* // Creating the Four cards */}
<section className="container mx-auto pt-10 pb-3 bg-white font-spaceGrotesk">
  
      <div className="flex flex-wrap justify-center">
        <div className="flex flex-row justify-center mb:flex-col mb:justify-center mb:w-full mb:text-xs">
        <div className="w-40p sm:w-full lg:w-40p px-4 mb-8 mb:w-full ">
          <div className="bg-[#EAFBEE] p-6  shadow-md h-full border border-green-500 rounded-2xl">
            <h2 className="text-xl font-semibold mb-2 text-black">Smart AI Interviewer</h2>
            <div className="flex flex-row justify-between">
            <p className="text-gray-700 w-1/2">
              Shot uses cutting-edge AI to simplify interviews, helping you quickly find the best candidates.
            </p>
            <div className="w-1/2 flex justify-center">
              <Image src="/Illustration1.png" alt="Illustration1" width={130} height={130} className="" />
            </div>
            </div>
          </div>
        </div>
        <div className="w-40p sm:w-full mb:w-full lg:w-40p px-4 mb-8">
          <div className="bg-[#EAFBEE] p-6  rounded-2xl shadow-md h-full border border-green-500">
            <h2 className="text-xl font-semibold mb-2 text-black">Technical Interviews, whenever, wherever.</h2>
            <div className="flex flex-row justify-between">
            <p className="text-gray-700 w-1/2">
              Automate interview arrangements with Shot’s round-the-clock scheduling, eliminating coordination headaches.
            </p>
            <div className="w-1/2 flex justify-center" >
            <Image src="/Illustration2.png" alt="Illustration2" width={110} height={110} className="" />
            </div>
            </div>
          </div>
        </div>
        </div>
        <div className="flex flex-row justify-center mb:flex-col mb:justify-center mb:w-full mb:text-xs">
        <div className="w-40p sm:w-full mb:w-full lg:w-40p px-4 mb-8">
          <div className="bg-[#EAFBEE] p-6  rounded-2xl shadow-md h-full border border-green-500">
            <h2 className="text-xl font-semibold mb-2 text-black">Email Marketing</h2>
            <div className="flex flex-row justify-between">
            <p className="text-gray-700 w-1/2">
              Engage in live, dynamic video interviews tailored to various screening needs, including technical evaluations and coding tests.
            </p>
            <div className="w-1/2 flex justify-center">
            <Image src="/pic3.png" alt="Illustration2" width={110} height={110} className="" />
            </div>
            </div>
          </div>
        </div>
        <div className="w-40p sm:w-full mb:w-full lg:w-40p px-4 mb-8">
          <div className="bg-[#EAFBEE] p-6  rounded-2xl shadow-md h-full border border-green-500">
            <h2 className="text-xl font-semibold mb-2 text-black">Detailed Candidate Insights</h2>
            <div className="flex flex-row justify-between">
            <p className="text-gray-700 w-1/2">
              Receive detailed reports after each interview, customized to your hiring criteria for confident decisions.
            </p>
            <div className="w-1/2 flex justify-center">
            <Image src="/pic4.png" alt="Illustration1" width={130} height={130} className="" />
            </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
    <section className="container mx-auto px-4 pt-3 bg-white font-spaceGrotesk text-black lg:w-[82%] mb:w-full">
    <div className="container mx-auto px-4 py-8 font-[600]">
      <div className="bg-[#3D8A3C] rounded-lg flex flex-col md:flex-row justify-around items-center py-12 px-8">
        <div className="flex-1 flex flex-col items-center text-white text-center mb-8 md:mb-0">
          <p>Personalized, conversational interviews</p>
        </div>
        <div className="w-full md:w-auto h-1 md:h-auto md:border-r border-t md:border-t-0 border-white my-4 md:my-0"></div>
        <div className="flex-1 flex flex-col items-center text-white text-center mb-8 md:mb-0">
          <p>Unbiased, consistent evaluations</p>
        </div>
        <div className="w-full md:w-auto h-1 md:h-auto md:border-r border-t md:border-t-0 border-white my-4 md:my-0"></div>
        <div className="flex-1 flex flex-col items-center text-white text-center">
          <p>Flexible scheduling</p>
        </div>
      </div>
    </div>
      
    </section>
</>
    )
}

export default Content1