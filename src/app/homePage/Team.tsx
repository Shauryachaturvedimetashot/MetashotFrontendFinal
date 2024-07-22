import React from "react";
import Image from "next/image";

const teamMembers = [
    {
      name: "Sebbin Joshy",
      title: "Founder",
      experience: "10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy",
      imageUrl: "Sebbin Joshy.png",
      linkedin: "#"
    },
    {
      name: "Mohammed Shahid",
      title: "Co-Founder",
      experience: "7+ years of experience in project management and team leadership. Strong organizational and communication skills",
      imageUrl: "Mohammed Shahid.png",
      linkedin: "#"
    },
    {
      name: "Sameer",
      title: "Senior Software Dev",
      experience: "5+ years of experience in SEO and content creation. Proficient in keyword research and on-page optimization",
      imageUrl: "Sameer.png",
      linkedin: "#"
    },
    {
      name: "Gokul",
      title: "AI Dev",
      experience: "3+ years of experience in paid search advertising. Skilled in campaign management and performance analysis",
      imageUrl: "Gokul.png",
      linkedin: "#"
    },
    {
      name: "Shaurya",
      title: "Full Stack Dev",
      experience: "4+ years of experience in social media marketing. Proficient in creating and scheduling content, analyzing metrics, and building engagement",
      imageUrl: "Shaurya.png",
      linkedin: "#"
    },
    {
      name: "Raees",
      title: "Full Stack Dev",
      experience: "2+ years of experience in writing and editing. Skilled in creating compelling, SEO-optimized content for various industries",
      imageUrl: "Raees.png",
      linkedin: "#"
    }
  ]

const Team:React.FC = ()=>{
    return (
        <div className="bg-white py-16  font-spaceGrotesk">
      <div className="text-center mb-12 flex flex-row ml-5p">
        <h2 className="text-4xl font-bold text-black">Team</h2>
        <p className="text-black pl-[2%] w-[30%] text-sm text-left">
          Meet the skilled and experienced team behind our successful digital marketing strategies
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-[85%] text-black mx-auto">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-1 text-center border border-black w-[80%] h-[250px] mx-auto">
            <div className="mb-4 flex items-center justify-center mt-5p">
              <Image
                src={`/${member.imageUrl}`}
                alt={member.name}
                width={250}
                height={250}
                className=""
              />
            </div>
            <p className="mt-6 text-gray-700 text-base font-medium ">
              {member.experience}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
      








}

export default Team