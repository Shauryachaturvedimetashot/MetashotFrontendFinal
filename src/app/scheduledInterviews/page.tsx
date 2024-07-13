/* ScheduledInterviews.tsx */
"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import styles from "./ScheduledInterviews.module.css";

const ScheduledInterviews = () => {
  const [scheduledInterviews, setScheduledInterviews] = useState<any[]>([]);
  const [selectedScheduledInterview, setSelectedScheduledInterview] = useState<any | null>(null);

  useEffect(() => {
    const fetchScheduledInterviews = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const interviewId = typeof window !== "undefined" ? window.location.search.split("=")[1] : null; // Extract interview ID from URL query

        if (interviewId) {
          const response = await axios.get(`https://metashot-backend.azurewebsites.net/interview/schedule?interview=${interviewId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setScheduledInterviews(response.data);
        } else {
          console.log("No interview ID provided.");
        }
      } catch (error) {
        console.error("Error fetching scheduled interviews:", error);
      }
    };

    fetchScheduledInterviews();
  }, []);

  const handleShowScheduledInterviewDetails = (scheduledInterview: any) => {
    setSelectedScheduledInterview(scheduledInterview);
  };

  const handleCloseModal = () => {
    setSelectedScheduledInterview(null);
  };

  return (
    <div className={styles.container}>
      <h1 className="text-black font-semibold">Scheduled Interviews</h1>
      <div className={styles.scheduledInterviewsList}>
        {scheduledInterviews.length === 0 ? (
          <p>No scheduled interviews found.</p>
        ) : (
          scheduledInterviews.map((scheduledInterview) => (
            <div key={scheduledInterview._id} className={styles.scheduledInterviewCard}>
              <h2>Interview Scheduled on {new Date(scheduledInterview.start).toLocaleString()}</h2>
              <button
                className={styles.detailsButton}
                onClick={() => handleShowScheduledInterviewDetails(scheduledInterview)}
              >
                Show Details
              </button>
            </div>
          ))
        )}
      </div>
      {selectedScheduledInterview && (
        <div className={styles.detailsModal} onClick={handleCloseModal}>
          <div className={styles.detailsContent}>
            <h2>Scheduled Interview Details</h2>
            <p><strong>Start:</strong> {new Date(selectedScheduledInterview.start).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(selectedScheduledInterview.end).toLocaleString()}</p>
            <p><strong>Candidates:</strong> {selectedScheduledInterview.candidates.join(", ")}</p>
            <p><strong>Status:</strong> {selectedScheduledInterview.status}</p>
            <p><strong>Date Created:</strong> {new Date(selectedScheduledInterview.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className={styles.backButton}>
        <Link href="/PastInterviews">
          Back to Past Interviews
        </Link>
      </div>
    </div>
  );
};

export default ScheduledInterviews;
