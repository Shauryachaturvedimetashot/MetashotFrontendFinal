import React , {useState}from "react";
import Image from "next/image";
const steps =[
    {
        q:"01",
        title: 'Book a call and help us understand you',
        content: 'During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.'
      },
      {
        q:"02",
        title: 'Post your Job with Shot',
        content: 'Post your job details with us and we will ensure it reaches the right audience, leveraging our extensive network and expertise.'
      },
      {
        q:"03",
        title: 'Use shot to find the best candidate',
        content: 'Our advanced matching algorithm and screening process will help you find the best candidates for your job postings efficiently.'
      },
      {
        q:"04",
        title: 'Intuitive reports and privacy - Take your data with you',
        content: 'Get detailed reports and insights on your hiring process. Your data privacy is our top priority, and you can take your data with you anytime.'
      }
]

const Content2:React.FC = () =>{
    

    const [openStep,setOpenStep] = useState<number|null> (0)
    const toggleStep = (index:number) =>{
        setOpenStep(openStep === index ? null : index)

    }

    return(
        <>
        <div className="flex items-center justify-center bg-white">
      <div className="container mx-auto p-4  text-black font-spaceGrotesk bg-white flex flex-col items-center justify-center">
        {steps.map((step, index) => (
          <div key={index} className="border rounded-3xl my-2 w-80p h-3/4 bg-[#EAFBEE]  border-black">
            <div className="flex justify-start items-center p-4 cursor-pointer" onClick={() => toggleStep(index)}>
                <h1 className="ml-1p text-3xl w-1p">
                    {step.q}
                </h1>

              <h2 className="text-lg font-semibold  ml-1p mb:ml-5p w-80p">{step.title}</h2>
              
              <span className="w-17p text-xl text-right ">{openStep === index ? '-' : '+'}</span>
              
              
            </div>
            {openStep === index && (
              <div className="p-4 border-t">
                <p>{step.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      



    </div>
    {/* <div className="flex item justify-center items-center bg-white pb-16">
        <div className="bg-[#3D8A3C] w-80p h-[35vh] rounded-3xl">

        <div className="flex flex-row justify-start">
            <div className="w-[60%]">
                <div className="text-left w-[60%] ml-5p ">
                Hiring with the SHOT has been an amazing experience - we straight up saved 300 Hours

                </div>
                
            </div>
            <div className="flex justify-center w-[40%] items-center">
            <Image src="/Illustration4.png" alt="Illustration4" width={250} height={250} layout="" className="" />
            </div>

        </div>

        </div>

      </div> */}
     <div className="flex items-center justify-center bg-white pb-4 pt-[2.2%]">
      <div className="bg-[#3D8A3C] lg:w-[80%] h-auto rounded-3xl">
        <div className="flex flex-col lg:flex-row justify-start h-full">
          <div className="w-full lg:w-[60%] flex items-center p-4">
            <div className="text-left w-full ml-0 lg:ml-5 text-black font-bold">
              <div className="bg-[#EAFBEE] rounded-lg p-4 lg:text-lg xl:text-xl">
                Hiring with the SHOT has been an amazing experience - we straight up saved 300 Hours
              </div>
              <div className="text-right text-xs mt-2">- Joshy</div>
            </div>
          </div>
          <div className="flex justify-center items-center w-full lg:w-[40%] p-4">
            <Image src="/Illustration4.png" alt="Illustration4" width={250} height={250} className="max-w-full h-auto" />
          </div>
        </div>
      </div>
    </div>

        </>
    )

}


export default Content2