import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassStart, faHourglassEnd } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import styles from "./Invite.module.css";

interface Candidate {
  name: string;
  mail: string;
  number: string;
}

interface Interview {
  _id: string;
  jobPosition: string;
  yearsOfExperience: string;
  jobDescription: string;
  technicalSkills: string[];
  questions: { skill: string; questions: string[] }[];
}

function CandidateScreen() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [error, setError] = useState<string>("");

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formName, setFormName] = useState<string>("");
  const [formMail, setFormMail] = useState<string>("");
  const [formNumber, setFormNumber] = useState<string>("");

  const [redirect, setRedirect] = useState<boolean>(false);
  const [showCandidateForm, setShowCandidateForm] = useState<boolean>(false);

  const [customMessage, setCustomMessage] = useState<string>("");
  const [showCustomMessageForm, setShowCustomMessageForm] = useState<boolean>(false);

  const [jobDescription, setJobDescription] = useState<string>("");
  const [showJobDescriptionForm, setShowJobDescriptionForm] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interview");

  const handleModalClose = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormName("");
    setFormMail("");
    setFormNumber("");
  };

  const validateDates = () => {
    if (startDate && endDate && endTime && startTime) {
      if (
        endDate < startDate ||
        (endDate.getTime() === startDate.getTime() && endTime < startTime)
      ) {
        setError("End date/time must be later than start date/time");
      } else {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const dayDiff = timeDiff / (3600 * 24 * 1000);
        if (dayDiff < 3) {
          setError("Minimum 3 days required for the event");
        } else {
          setError("");
        }
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formName.trim() || !formMail.trim() || !formNumber.trim()) {
      setError("All fields are required");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddCandidate = (): void => {
    if (validateForm()) {
      if (formNumber.trim().length !== 10) {
        setError("Phone number must be 10 digits");
        setFormNumber("");
        return;
      }
      const newCandidate: Candidate = {
        name: formName.trim(),
        mail: formMail.trim(),
        number: formNumber.trim(),
      };
      if (isEditing) {
        const updatedCandidates = candidates.map((c, index) =>
          index === editIndex ? newCandidate : c
        );
        setCandidates(updatedCandidates);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        setCandidates([...candidates, newCandidate]);
      }
      setFormName(""); // Clear form after adding/editing
      setFormMail("");
      setFormNumber("");
    }
  };

  const handleEditCandidate = (index: number): void => {
    const candidate = candidates[index];
    setFormName(candidate.name);
    setFormMail(candidate.mail);
    setFormNumber(candidate.number);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteCandidate = (index: number): void => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleCreateEvent = async () => {
    if (!interviewId) {
      setError("Interview ID is missing");
      return;
    }

    if (!startDate || !endDate || !startTime || !endTime) {
      setError("Please select start and end date/time");
      return;
    }

    if (candidates.length === 0) {
      setError("Please add at least one candidate");
      return;
    }

    const timeDiff = endDate.getTime() - startDate.getTime();
    const dayDiff = timeDiff / (3600 * 24 * 1000);
    if (dayDiff < 3) {
      setError("Minimum 3 days required for the event");
      return;
    }

    const payload = {
      interview: interviewId,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      candidates: candidates.map((candidate) => ({
        email: candidate.mail,
        name: candidate.name,
      })),
      customMessage,
      jobDescription,
      companyName:"Metashot"
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authorization token is missing");
        return;
      }

      // const response = await axios.post(
      //   "https://metashot-backend.azurewebsites.net/interview/schedule",
      //   payload,
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );
      const response = await axios.post(
        "http://localhost:8000/interview/schedule",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setRedirect(true);
      } else {
        setError("Failed to schedule the interview");
      }
    } catch (error) {
      console.error("Error scheduling the interview:", error);
      setError("An error occurred while scheduling the interview");
    }
  };

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authorization token is missing");
        return;
      }

      const response = await axios.get(
        "https://metashot-backend.azurewebsites.net/interview/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const interviews: Interview[] = response.data;
        const interview = interviews.find((int) => int._id === interviewId);
        if (interview) {
          setJobDescription(interview.jobDescription);
        }
      } else {
        setError("Failed to fetch interviews");
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
      setError("An error occurred while fetching interviews");
    }
  };

  useEffect(() => {
    validateDates();
  }, [startDate, endDate, startTime, endTime]);

  useEffect(() => {
    if (showJobDescriptionForm) {
      fetchInterviews();
    }
  }, [showJobDescriptionForm]);

  return (
    <>
      <div className={`w-80p ${styles['container']}`}>
        <div className="mt-4 text-4xl font-semibold text-black">Schedule your interview</div>
        <div className="flex flex-row text-black ">
          <div className={`mt-8 bg-[#E2F3E5]  rounded-md pr-2 pt-2 h-30p w-50p pb-2 ${styles['dtContainer']}`}>
            <div className={`flex justify-start `}>
              <div className="px-4 mr-10 w-10p">
                <FontAwesomeIcon icon={faHourglassStart} className="mr-2 text-black fas fa-check mb:hidden" />
                Start
              </div>
              <div className="px-10 text-black">
                <DatePicker
                  selected={startDate}
                  dateFormat={"EEE/d-MMM"}
                  onChange={(date) => setStartDate(date)}
                  className="text-center rounded-md invite_time hover:cursor-pointer"
                />
              </div>
              <div className="text-black">
                <DatePicker
                  selected={startTime}
                  onChange={(date) => setStartTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="text-center rounded-md bg-[#c5d8c5] hover:cursor-pointer"
                />
              </div>
            </div>
            <div className={`flex items-center mt-5 justify-start text-black `}>
              <div className="px-4 mr-10">
                <FontAwesomeIcon icon={faHourglassEnd} className="mr-2 fas fa-check" style={{ color: "black" }} />
                Stop
              </div>
              <div className="px-10">
                <DatePicker
                  selected={endDate}
                  dateFormat={"EEE/d-MMM"}
                  onChange={(date) => setEndDate(date)}
                  className="text-center rounded-md bg-[#c5d8c5] hover:cursor-pointer"
                />
              </div>
              <div>
                <DatePicker
                  selected={endTime}
                  onChange={(date) => setEndTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="text-center rounded-md invite_time hover:cursor-pointer"
                />
              </div>
            </div>
            
          </div>
        </div>
        {error && <div className=" text-red-600">{error}</div>}

        <div className="mt-6">
          <button
            className="rounded-md bg-[#E2F3E5] text-black font-semibold w-96 py-2 px-4 invite_button"
            onClick={() => setShowCandidateForm(true)}
          >
            Add Candidate
          </button>
        </div>

        <div className="mt-6">
          <button
            className="rounded-md bg-[#E2F3E5] text-black font-semibold w-96 py-2 px-4 invite_button"
            onClick={() => setShowCustomMessageForm(true)}
          >
            Custom Message
          </button>
        </div>

        <div className="mt-6">
          <button
            className="rounded-md bg-[#E2F3E5] text-black font-semibold w-96 py-2 px-4 invite_button"
            onClick={() => setShowJobDescriptionForm(true)}
          >
            Review Job Description
          </button>
        </div>

        <div className="mt-6">
          <button
              className={`w-8/12 px-4 py-2 text-white bg-green-600 rounded-md ${(!startDate || !endDate || !startTime || !endTime || candidates.length === 0 || !!error) && "opacity-50 cursor-not-allowed"}`}

            onClick={handleCreateEvent}
          >
            Schedule Interview
          </button>
          {redirect && (
            <Link href="/PastInterviews" className="block mt-4 text-blue-500">
              Interview scheduled successfully! Click here to view past interviews.
            </Link>
          )}
        </div>
      </div>

      {showCandidateForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="p-6 text-black bg-green-200 rounded-md shadow-md w-[800px]">
            <h2 className="mb-4 text-xl font-bold">{isEditing ? "Edit Candidate" : "Add Candidate"}</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="col-span-1">
                <div>
                  <label className="block mb-1 text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-1 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
                  
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={formMail}
                    onChange={(e) => setFormMail(e.target.value)}
                    className="w-full px-3 py-1 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
                  
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full px-3 py-1 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  />
                  {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 mr-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => {
                      handleModalClose();
                      setShowCandidateForm(false);
                    }}
                  >
                    Finish
                  </button>
                  <button
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onClick={handleAddCandidate}
                  >
                    {isEditing ? "Save Changes" : "Add Candidate"}
                  </button>
                </div>
              </div>
              <div className="col-span-1 overflow-y-auto h-72">
                <div className="mb-4 text-xl font-bold">Added Candidates</div>
                {candidates.map((candidate, index) => (
                  <div key={index} className="flex items-center justify-between p-2 mb-2 bg-gray-100 rounded-md">
                    <div className="text-lg font-bold">{candidate.name}</div>
                    <div>
                      <button className="mr-2 text-blue-600" onClick={() => handleEditCandidate(index)}>
                        Edit
                      </button>
                      <button className="text-red-600" onClick={() => handleDeleteCandidate(index)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCustomMessageForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="p-6 text-black bg-green-300 rounded-md shadow-md w-[800px] mt-4">
            <h2 className="mb-4 text-xl font-bold">Custom Message</h2>
            <div className="col-span-1">
              <div>
                <label className="block mb-1 text-sm font-medium">Message</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full h-24 px-3 py-1 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 mr-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setShowCustomMessageForm(false)}
              >
                Finish
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => setShowCustomMessageForm(false)}
              >
                Save Message
              </button>
            </div>
          </div>
        </div>
      )}

      {showJobDescriptionForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="p-6 text-black bg-green-300 rounded-md shadow-md w-[800px] mt-4">
            <h2 className="mb-4 text-xl font-bold">Review Job Description</h2>
            <div className="col-span-1">
              <div>
                <label className="block mb-1 text-sm font-medium">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-24 px-3 py-1 border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 mr-2 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setShowJobDescriptionForm(false)}
              >
                Finish
              </button>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CandidateScreen;
