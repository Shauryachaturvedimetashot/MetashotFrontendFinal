"use client";
import React, { useState } from "react";
import Form from "./Form";
import Sidebarn from "../../Components/SidebarN"; 
import Navbarn from "../../Components/Navbarn"; 
const InterviewPage = () => {
  const [interviewName, setInterviewName] = useState("Your job title");

  const handleJobPositionChange = (jobPosition: string) => {
    setInterviewName(jobPosition);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbarn company="Metashot" user_name="Metashot" /> {/* Include Navbarn component at the top */}
      <div className="flex flex-1">
        <Sidebarn />
        <div className="w-full max-w-screen-md h-full flex flex-col p-4">
          <Form interviewName={interviewName} onJobPositionChange={handleJobPositionChange} />
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
