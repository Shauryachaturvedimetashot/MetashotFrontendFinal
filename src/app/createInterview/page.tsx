"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";

const CreateInterview = () => {
  // State for interview details
  const [interviewDetails, setInterviewDetails] = useState({
    interviewName: "Avengers Cricket Team",
    hosts: "Iron Man, Thor & Virat Kohli",
    date: "2024-08-07",
    time: "09:00",
    customMessage: "Thank you for joining. We hope you enjoyed the event! You have no upcoming sessions. Know someone who may be interested in this event?",
    aboutRole: "Details about the role...",
  });

  // Simulated fetch from backend (replace with actual fetch logic)
  useEffect(() => {
    // Replace with actual API call to fetch interview details
  }, []);

  const scheduledDate = new Date(`${interviewDetails.date}T${interviewDetails.time}:00Z`);

  const handleStartInterviewClick = (e:any) => {
    const currentDate = new Date();
    if (currentDate < scheduledDate) {
      e.preventDefault();
      alert("It is not yet the time for the interview.");
    }
  };

  return (
    <div className="min-h-screen bg-green-100 p-8">
      <div className="bg-green-200 p-4 rounded-md">
        <div className="mb-4 text-center">
          <img
            src="https://cdn.pixabay.com/photo/2022/01/22/01/55/interview-6956089_1280.png"
            alt="Cover Image"
            className="mx-auto"
            style={{ width: "800px", height: "300px" }}
          />
        </div>
        <div className="bg-green-100 p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <h2 className="text-2xl text-black font-bold text-center mb-4">{interviewDetails.interviewName}</h2>
              <p className="text-black">
                <span className="font-bold">Hosted by: </span>
                {interviewDetails.hosts}
              </p>
              <p className="text-black mt-2">
                <span className="font-bold">Date: </span>
                {interviewDetails.date}
              </p>
              <p className="text-black mt-2">
                <span className="font-bold">Time: </span>
                {interviewDetails.time}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded-md mt-4">
          <h3 className="text-xl font-bold text-black">Custom Message</h3>
          <p className="text-black">{interviewDetails.customMessage}</p>
        </div>
        <div className="flex justify-between items-start mt-4">
          <div className="bg-green-100 p-4 rounded-md flex-1 mr-2">
            <h3 className="text-xl font-bold text-black">About Role</h3>
            <p className="text-black">{interviewDetails.aboutRole}</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <div className="flex items-center">
            <Link href="/startInterview" legacyBehavior>
              <a
                onClick={handleStartInterviewClick}
                className="bg-green-300 text-black font-bold px-4 py-2 rounded hover:bg-green-400 mr-2"
              >
                Start Interview
              </a>
            </Link>
            <Link href="/practiceInterview" legacyBehavior>
              <a className="bg-green-300 text-black font-bold px-4 py-2 rounded hover:bg-green-400">
                Take Practice Interview
              </a>
            </Link>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Link href="/InterviewCreation" legacyBehavior>
            <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Finish
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;
