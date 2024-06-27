"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import NavbarN from "../../Components/Navbarn";
import SidebarN from "../../Components/SidebarN";
import styles from "./Candidates.module.css";

interface Candidate {
  email: string;
}

interface ScheduledInterview {
  _id: string;
  start: string;
  end: string;
  candidates: string[];
  status: string;
  createdAt: string;
}

const CandidatesPage: React.FC = () => {
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(8);
  const searchParams = useSearchParams();
  const interviewId = searchParams.get('interview');

  useEffect(() => {
    const fetchScheduledInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (interviewId && token) { // Added token check
          const response = await axios.get(`https://metashotbackend.azurewebsites.net/interview/schedule?interview=${interviewId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setScheduledInterviews(response.data); // Set all scheduled interviews
        } else {
          console.log("No interview ID or token provided.");
        }
      } catch (error) {
        console.error("Error fetching scheduled interviews:", error);
      }
    };

    fetchScheduledInterviews();
  }, [interviewId]); // Added interviewId as dependency

  // Flattening candidates from scheduled interviews
  const candidates = scheduledInterviews.flatMap(interview => 
    interview.candidates.map(candidate => ({
      email: candidate,
      start: interview.start,
      end: interview.end
    }))
  );

  // Pagination logic
  const totalPages = Math.ceil(candidates.length / candidatesPerPage);
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = candidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

  // Handlers for pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles.container}>
      <NavbarN company="Your Company" user_name="User Name" />
      <div className={styles.mainContent}>
        <SidebarN />
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className="text-black text-bold">Candidates</h1>
            <button className={styles.sortButton}>Sort: A-Z</button>
          </div>
          <div className={styles.candidatesTable}>
            <table>
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Score</th>
                  <th>Notes</th>
                  <th>Review Interview</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                {currentCandidates.length > 0 ? (
                  currentCandidates.map(candidate => (
                    <tr key={candidate.email}>
                      <td>{candidate.email}</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>{new Date(candidate.start).toLocaleString()}</td>
                      <td>{new Date(candidate.end).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>No candidates found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.pagination}>
            <button onClick={prevPage} disabled={currentPage === 1}>&lt;</button>
            <span>Page: {currentPage}/{totalPages}</span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesPage;
