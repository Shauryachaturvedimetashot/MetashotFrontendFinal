"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import NavbarN from "../../Components/Navbarn";
import SidebarN from "../../Components/SidebarN";
import styles from "./PastInterviews.module.css";

interface Interview {
  _id: string;
  jobPosition: string;
  jobDescription: string;
  yearsOfExperience: number;
  technicalSkills: string[];
  createdAt: string;
}

const Interviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://metashotbackend.azurewebsites.net/interview/getAll", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInterviews(response.data);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchInterviews();
  }, []);

  const handleShowDetails = (interview: Interview) => {
    setSelectedInterview(interview);
  };

  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).className.includes('detailsModal')) {
      setSelectedInterview(null);
    }
  };

  return (
    <div className={styles.container}>
      <NavbarN company="Your Company" user_name="User Name" />
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
              interviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((interview) => (
                <div key={interview._id} className={styles.interviewCard}>
                  <h2 className={styles.jobPosition}>{interview.jobPosition} - {interview.yearsOfExperience} years experience</h2>
                  <p className={styles.jobDescription}>{interview.jobDescription}</p>
                  <button
                    className={styles.detailsButton}
                    onClick={() => handleShowDetails(interview)}
                  >
                    Show Details
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
            <p><strong>Job Description:</strong> {selectedInterview.jobDescription}</p>
            <p><strong>Experience Required:</strong> {selectedInterview.yearsOfExperience} years</p>
            <p><strong>Skills Required:</strong> {selectedInterview.technicalSkills.join(", ")}</p>
            <p><strong>Date Created:</strong> {new Date(selectedInterview.createdAt).toLocaleString()}</p>
            <div className={styles.buttonGroup}>
              <Link href={`/Invite?interview=${selectedInterview._id}`} legacyBehavior>
                <a className={styles.addCandidatesButton}>Add New Candidates</a>
              </Link>
              <Link href={`/Candidates?interview=${selectedInterview._id}`} legacyBehavior>
                <a className={styles.scheduledInterviewsButton}>View Candidates</a>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;
