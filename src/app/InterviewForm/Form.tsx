"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";

interface FormProps {
  interviewName: string;
  onJobPositionChange: (jobPosition: string) => void;
}

const Form: React.FC<FormProps> = ({ interviewName, onJobPositionChange }) => {
  const [jobPosition, setJobPosition] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [isFormComplete, setIsFormComplete] = useState(false);

  const handleJobPositionInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setJobPosition(value);
    onJobPositionChange(value); // Notify parent about job position change
  };

  const handleYearsOfExperienceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setYearsOfExperience(event.target.value);
  };

  const handleJobDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(event.target.value);
  };

  const handleTechnicalSkillsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTechnicalSkills(event.target.value.split(",").map((skill) => skill.trim()));
  };

  const handleSubmit = () => {
    const formData = {
      jobPosition,
      yearsOfExperience,
      jobDescription,
      technicalSkills,
    };
    localStorage.setItem("formData", JSON.stringify(formData));
    localStorage.setItem("skills", JSON.stringify(technicalSkills)); // Store technical skills in localStorage
    window.location.href = "/addQuestions";
  };

  useEffect(() => {
    const isComplete =
      jobPosition !== "" &&
      yearsOfExperience !== "" &&
      jobDescription !== "" &&
      technicalSkills.length >= 2;
    setIsFormComplete(isComplete);
  }, [jobPosition, yearsOfExperience, jobDescription, technicalSkills]);

  return (
    <div className="p-4 h-full flex flex-col overflow-hidden">
      <h1 className="text-2xl font-semibold mb-4 text-center text-black">{interviewName}</h1>
      <form className="flex flex-col flex-1 overflow-y-auto" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="jobPosition" className="text-black mb-2">
          Job Position
        </label>
        <input
          type="text"
          id="jobPosition"
          className="border border-gray-300 rounded px-2 py-1 mb-2 focus:outline-none focus:border-blue-400 text-black"
          required
          value={jobPosition}
          onChange={handleJobPositionInputChange}
        />

        <label htmlFor="yearsExperience" className="text-black mb-2">
          Years of Experience Required
        </label>
        <input
          type="number"
          id="yearsExperience"
          className="border border-gray-300 rounded px-2 py-1 mb-2 focus:outline-none focus:border-blue-400 text-black"
          required
          value={yearsOfExperience}
          onChange={handleYearsOfExperienceChange}
        />

        <label htmlFor="jobDescription" className="text-black mb-2">
          Job Description
        </label>
        <textarea
          id="jobDescription"
          className="border border-gray-300 rounded px-2 py-1 mb-2 h-24 focus:outline-none focus:border-blue-400 text-black"
          required
          value={jobDescription}
          onChange={handleJobDescriptionChange}
        />

        <label htmlFor="technicalSkills" className="text-black mb-2">
          Technical Skills (minimum 2 required, comma separated)
        </label>
        <input
          type="text"
          id="technicalSkills"
          className="border border-gray-300 rounded px-2 py-1 mb-2 focus:outline-none focus:border-blue-400 text-black"
          required
          onChange={handleTechnicalSkillsChange}
        />

        <button
          className="bg-green-600 text-black text-bold px-3 py-2 rounded hover:bg-green-400 w-full mt-2 cursor-pointer text-center"
          onClick={handleSubmit}
          disabled={!isFormComplete}
        >
          Go to Add Questions
        </button>
      </form>
    </div>
  );
};

export default Form;
