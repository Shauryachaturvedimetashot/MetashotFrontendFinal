"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import NavbarN from "../../Components/Navbarn";
import SidebarN from "../../Components/SidebarN";
import styles from "./PastInterviews.module.css";
import { IoMdCloudDownload } from "react-icons/io";
import apiClient from "@/src/utils/axiosSetup";
interface Interview {
  _id: string;
  jobPosition: string;
  jobDescription: string;
  yearsOfExperience: number;
  technicalSkills: string[];
  createdAt: string;
  status: string;
  from?: string; // Add optional from field
  to?: string; // Add optional to field
}

const Interviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null
  );

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://metashot-backend.azurewebsites.net/interview/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const interviews = response.data;

      const enrichedInterviews = await Promise.all(
        interviews.map(async (interview: any) => {
          const scheduleResponse = await axios.get(
            `https://metashot-backend.azurewebsites.net/interview/schedule?interview=${interview._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const scheduleData = scheduleResponse.data;
          const recentSchedule = scheduleData.sort(
            (a: any, b: any) =>
              new Date(b.end).getTime() - new Date(a.end).getTime()
          )[0];
          const toTime = recentSchedule
            ? recentSchedule.end
            : interview.updatedAt;

          return {
            ...interview,
            from: new Date(interview.createdAt).toLocaleDateString(),
            to: new Date(toTime).toLocaleDateString(),
          };
        })
      );

      setInterviews(enrichedInterviews);
      // console.log("Interviews fetched:", enrichedInterviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleShowDetails = (interview: Interview) => {
    setSelectedInterview(interview);
  };

  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).className.includes("detailsModal")) {
      setSelectedInterview(null);
    }
  };

  const handleStatusToggle = async (
    interviewId: string,
    currentStatus: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://metashot-backend.azurewebsites.net/interview/changeStatus`,
        {
          interviewId,
          status: currentStatus === "active" ? "deactive" : "active",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchInterviews(); // Refresh the interviews list after status change
    } catch (error) {
      console.error("Error toggling interview status:", error);
    }
  };

  const handleAddCandidates = (interviewId: string, status: string) => {
    if (status === "active") {
      // Navigate to the Invite page
      window.location.href = `/Invite?interview=${interviewId}`;
    } else {
      // Show alert if interview is inactive
      alert("You need to activate the interview to add more candidates.");
    }
  };
  const handleSubmit = async (interviewId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(
        `/interview/download?interviewId=${interviewId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      // Check if the response is actually an Excel file
      if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // Process the Excel file as before
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `candidates_${interviewId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }  else {
        // It's not an Excel file, so it's probably a JSON error
        const reader = new FileReader();
        reader.onload = function() {
          const errorMessage = JSON.parse(reader.result as string);
          console.error("Server returned an error:", errorMessage.error);
          // Handle the error appropriately
        };
        reader.readAsText(response.data);
      }
    } catch (error:any) {
      if (error.response && error.response.data) {
        const reader = new FileReader();
        reader.onload = function() {
          const errorMessage = JSON.parse(reader.result as string);
          console.error("Error downloading interviews:", errorMessage.error);
          // Handle the error appropriately
        };
        reader.readAsText(error.response.data);
      } else {
        console.error("Error downloading interviews:", error.message);
      }
    }
  };
  return (
    <div className={styles.container}>
      <NavbarN />
      <div className={styles.mainContent}>
        <SidebarN />
        <div className={styles.content}>
          <div className={styles.header}>
            <h1>Your Past Interviews</h1>
            <Link href="/InterviewForm" legacyBehavior>
              <a className={styles.createButton}>Create New Interview</a>
            </Link>
          </div>
          <div className={styles.interviewsList}>
            {interviews.length === 0 ? (
              <p>No interviews found.</p>
            ) : (
              interviews
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((interview) => (
                  <div key={interview._id} className={styles.interviewCard}>
                    <div className="flex justify-between">
                      <h2 className={styles.jobPosition}>
                        {interview.jobPosition} - {interview.yearsOfExperience}{" "}
                        years experience
                      </h2>
                      <button  onClick={()=>handleSubmit(interview._id)} className="bg-green-500 hover:bg-green-700/70 rounded-md p-2">
                        <IoMdCloudDownload/>
                      </button>
                    </div>
                    <p className={styles.jobDescription}>
                      {interview.jobDescription}
                    </p>
                    <p className={styles.status}>Status: {interview.status}</p>
                    <button
                      className={
                        interview.status === "active"
                          ? styles.deactivateButton
                          : styles.activateButton
                      }
                      onClick={() =>
                        handleStatusToggle(interview._id, interview.status)
                      }
                    >
                      {interview.status === "active"
                        ? "Deactivate it"
                        : "Activate it"}
                    </button>
                    <button
                      className={styles.detailsButton}
                      onClick={() => handleShowDetails(interview)}
                    >
                      Show Details
                    </button>
                    <button
                      className={styles.addCandidatesButton}
                      onClick={() =>
                        handleAddCandidates(interview._id, interview.status)
                      }
                    >
                      Add New Candidates
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
      {selectedInterview && (
        <div className={styles.detailsModal} onClick={handleCloseModal}>
          <div className={styles.detailsContent}>
            <h2>{selectedInterview.jobPosition}</h2>
            <p>
              <strong>Job Description:</strong>{" "}
              {selectedInterview.jobDescription}
            </p>
            <p>
              <strong>Experience Required:</strong>{" "}
              {selectedInterview.yearsOfExperience} years
            </p>
            <p>
              <strong>Skills Required:</strong>{" "}
              {selectedInterview.technicalSkills.join(", ")}
            </p>
            <p>
              <strong>Date Created:</strong>{" "}
              {new Date(selectedInterview.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>From:</strong> {selectedInterview.from}
            </p>
            <p>
              <strong>To:</strong> {selectedInterview.to}
            </p>
            <div className={styles.buttonGroup}>
              <Link
                href={`/Invite?interview=${selectedInterview._id}`}
                legacyBehavior
              >
                <a className={styles.addCandidatesButton}>Add New Candidates</a>
              </Link>
              <Link
                href={`/Candidates?interview=${selectedInterview._id}`}
                legacyBehavior
              >
                <a className={styles.scheduledInterviewsButton}>
                  View Candidates
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;
