import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faGlobe,
  faHourglassStart,
  faHourglassEnd,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../../Components/Modal";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import styles from "./Invite.module.css";

interface Candidate {
  name: string;
  mail: string;
  number: string;
}

interface FormErrors {
  name: string;
  mail: string;
  number: string;
}

function CandidateScreen() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [error, setError] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModal2, setShowModal2] = useState<boolean>(false);

  const [candidateName, setCandidateName] = useState<string>("");
  const [candidateMail, setCandidateMail] = useState<string>("");
  const [candidateNumber, setCandidateNumber] = useState<string>("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    mail: "",
    number: "",
  });

  const [redirect, setRedirect] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interview");

  const handleToggleChange = () => {
    if (!showModal2) {
      setShowModal2(true);
    } else {
      setShowModal2(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowModal2(false);
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
    const errors = { name: "", mail: "", number: "" };
    if (!candidateName) errors.name = "Required";
    if (!candidateMail) errors.mail = "Required";
    if (!candidateNumber) errors.number = "Required";
    setFormErrors(errors);
    return !errors.name && !errors.mail && !errors.number;
  };

  const handleAddCandidate = (): void => {
    if (validateForm()) {
      const newCandidate: Candidate = {
        name: candidateName,
        mail: candidateMail,
        number: candidateNumber,
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
      setCandidateName("");
      setCandidateMail("");
      setCandidateNumber("");
      setShowModal(false);
    }
  };

  const handleEditCandidate = (index: number): void => {
    const candidate = candidates[index];
    setCandidateName(candidate.name);
    setCandidateMail(candidate.mail);
    setCandidateNumber(candidate.number);
    setIsEditing(true);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDeleteCandidate = (index: number): void => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleCreateEvent = async () => {
    if (!interviewId) {
      setError("Interview ID is missing");
      return;
    }

    const payload = {
      interview: interviewId,
      start: startDate?.toISOString(),
      end: endDate?.toISOString(),
      candidates: candidates.map((candidate) => candidate.mail),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authorization token is missing");
        return;
      }

      const response = await axios.post(
        "https://metashotbackend.azurewebsites.net/interview/schedule",
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

  useEffect(() => {
    validateDates();
  }, [startDate, endDate, startTime, endTime]);

  return (
    <>
      <div className="ml-8 content">
        {/* <div className="flex flex-row justify-between mt-6 md:col-span-1">
          <button className="w-48 rounded-md bg-inherit invite_cand">
            <FontAwesomeIcon
              icon={faCalendar}
              className="mr-2 fas fa-check"
              style={{ color: "black" }}
            />
            <select id="type" className="font-semibold text-black invite_cand">
              <option value="invoice">Personal Calendar</option>
              <option value="payment">Public Calendar</option>
            </select>
          </button>
          <button
            className={`w-48 rounded-md mr-72 invite_cand ${styles["align1"]}`}
          >
            <FontAwesomeIcon
              icon={faGlobe}
              className="mr-2 fas fa-check"
              style={{ color: "black" }}
            />
            <select id="type" className="font-semibold text-black invite_cand">
              <option value="invoice">Public</option>
              <option value="payment">Private</option>
            </select>
          </button>
        </div> */}
        <div className="mt-4 text-5xl font-semibold text-black">
          {" "}
          Interview Name
        </div>
        <div className="flex flex-row text-black">
          <div
            className={`mt-8  bg-[#E2F3E5] h-24 rounded-md pr-2 pt-2 ${styles["main_box"]} `}
          >
            {/* For first row */}
            <div className={`flex ${styles["box2"]}`}>
              <div className="px-4 mr-10">
                <FontAwesomeIcon
                  icon={faHourglassStart}
                  className="mr-2 text-black fas fa-check"
                />
                Start
              </div>
              <div className="px-10 text-black">
                <DatePicker
                  selected={startDate}
                  dateFormat={"EEE/d-MMM"}
                  onChange={(date) => setStartDate(date)}
                  className="text-center rounded-md invite_time"
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
                  className="text-center rounded-md bg-[#c5d8c5]"
                />
              </div>
            </div>
            {/* Second row */}
            <div
              className={`flex items-center mt-5 justify-between text-black ${styles["box3"]}`}
            >
              <div className="px-4 mr-10">
                <FontAwesomeIcon
                  icon={faHourglassEnd}
                  className="mr-2 fas fa-check"
                  style={{ color: "black" }}
                />
                Stop
              </div>
              <div className="px-10">
                <DatePicker
                  selected={endDate}
                  dateFormat={"EEE/d-MMM"}
                  onChange={(date) => setEndDate(date)}
                  className="text-center rounded-md bg-[#c5d8c5]"
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
                  className="text-center rounded-md invite_time"
                />
              </div>
            </div>
            {error && <div className="mt-4 text-red-600">{error}</div>}
          </div>
        </div>

        <div className="mt-6">
          <button
            className="rounded-md bg-[#E2F3E5] text-black font-semibold w-96 py-2 px-4 invite_button"
            onClick={() => setShowModal(true)}
          >
            Add Candidate
          </button>
        </div>

        <div className="mt-6">
          <button
            className="rounded-md bg-[#E2F3E5] text-black font-semibold w-96 py-2 px-4 invite_button"
            onClick={() => setShowModal(true)}
          >
            Add cutsom message
          </button>
        </div>

        <div className="mt-6">
          <button
            className="rounded-md bg-[#E2F3E5] text-black font-semibold w-96 py-2 px-4 invite_button"
            onClick={() => setShowModal(true)}
          >
            Review job description
          </button>
        </div>

        <div className="mt-6">
          {candidates.map((candidate, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 mb-2 bg-gray-100 rounded-md"
            >
              <div>
                <div className="text-lg font-bold">{candidate.name}</div>
                <div>{candidate.mail}</div>
                <div>{candidate.number}</div>
              </div>
              <div>
                <button
                  className="mr-2 text-blue-600"
                  onClick={() => handleEditCandidate(index)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDeleteCandidate(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            className="w-8/12 px-4 py-2 text-white bg-green-600 rounded-md"
            onClick={handleCreateEvent}
          >
            Create Event
          </button>
        </div>

        {redirect && (
          <Link href="/EventCreated">
            Event created successfully. Click here to proceed.
          </Link>
        )}
      </div>

      <Modal
        isVisible={showModal}
        onClose={handleModalClose}
        isCustomMsg={false}
      >
        <div>
          <h2 className="mb-4 text-xl font-bold">
            {isEditing ? "Edit Candidate" : "Add Candidate"}
          </h2>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />
            {formErrors.name && (
              <div className="text-red-600">{formErrors.name}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md"
              value={candidateMail}
              onChange={(e) => setCandidateMail(e.target.value)}
            />
            {formErrors.mail && (
              <div className="text-red-600">{formErrors.mail}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Phone Number
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={candidateNumber}
              onChange={(e) => setCandidateNumber(e.target.value)}
            />
            {formErrors.number && (
              <div className="text-red-600">{formErrors.number}</div>
            )}
          </div>
          <button
            className="px-4 py-2 text-white bg-blue-600 rounded-md"
            onClick={handleAddCandidate}
          >
            {isEditing ? "Update Candidate" : "Add Candidate"}
          </button>
        </div>
      </Modal>

      <Modal
        isVisible={showModal2}
        onClose={handleModalClose}
        isCustomMsg={true}
      >
        <div>
          <h2 className="mb-4 text-xl font-bold">Custom Message</h2>
          <p>This is a custom message modal.</p>
        </div>
      </Modal>
    </>
  );
}

export default CandidateScreen;
