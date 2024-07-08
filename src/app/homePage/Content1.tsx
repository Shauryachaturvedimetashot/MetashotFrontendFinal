import React from "react";
import Image from "next/image";

const Content1:React.FC =()=>{
    return(
        <main className="container mx-auto px-4 py-16 bg-white">
      <div className="flex flex-wrap md:flex-nowrap justify-center">
        <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">Meet Shot – Your </h1>
          <h1 className="text-4xl font-bold mb-4">Expert Interviewer</h1>
          <p className="text-lg text-gray-700 mb-8">
            Streamline your hiring process with intelligent scheduling, interactive interviews, and comprehensive insights.
          </p>
          <button className="bg-green-500 text-white px-6 py-3 rounded-md">Book a Demo</button>
        </div>
        <div className="w-full md:w-1/2 h-1/5">
        <div className="pl-20">
        <Image src="/Illustration.jpg" alt="Illustration" width={300} height={300} layout="fixed" className=""/>

        </div>
        
        </div>
      </div>
      <div className="mt-12 text-center text-lg font-medium text-gray-800">
        Hiring shouldn’t be tiring, hire effortlessly with Shot
      </div>
    </main>
    )
}

export default Content1