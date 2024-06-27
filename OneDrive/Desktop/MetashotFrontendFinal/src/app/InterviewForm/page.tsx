// page.tsx
"use client";
import React, { useState } from "react";
import Form from "./Form";

const InterviewPage = () => {
  const [interviewName, setInterviewName] = useState("Dynamic Interview Name");

  const handleJobPositionChange = (jobPosition: string) => {
    setInterviewName(jobPosition);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-screen-md h-full flex flex-col p-4">
        <Form interviewName={interviewName} onJobPositionChange={handleJobPositionChange} />
      </div>
    </div>
  );
};

export default InterviewPage;
