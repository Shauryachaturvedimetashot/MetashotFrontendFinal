"use client";
import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

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

interface Score {
  Relevance: string;
  Clarity: string;
  Depth: string;
  Coherence: string;
  Language: string;
  TechnicalAccuracy: string;
  Creativity: string;
}

interface Report {
  Topic: string;
  Scores: Score[];
}

const mockReport: Report[] = [
  {
    Topic: "Security",
    Scores: [
      {
        Relevance: "10",
        Clarity: "12",
        Depth: "20",
        Coherence: "8",
        Language: "8",
        TechnicalAccuracy: "42",
        Creativity: "10",
      },
    ],
  },
  {
    Topic: "Operating Systems",
    Scores: [
      {
        Relevance: "9",
        Clarity: "12",
        Depth: "22",
        Coherence: "8",
        Language: "7",
        TechnicalAccuracy: "42",
        Creativity: "10",
      },
    ],
  },
  {
    Topic: "Databases",
    Scores: [
      {
        Relevance: "10",
        Clarity: "10",
        Depth: "20",
        Coherence: "8",
        Language: "7",
        TechnicalAccuracy: "40",
        Creativity: "10",
      },
    ],
  },
  {
    Topic: "Mobile Development",
    Scores: [
      {
        Relevance: "10",
        Clarity: "7",
        Depth: "15",
        Coherence: "6",
        Language: "6",
        TechnicalAccuracy: "35",
        Creativity: "10",
      },
    ],
  },
  {
    Topic: "Testing",
    Scores: [
      {
        Relevance: "0",
        Clarity: "1",
        Depth: "2",
        Coherence: "1",
        Language: "3",
        TechnicalAccuracy: "0",
        Creativity: "2",
      },
    ],
  },
  {
    Topic: "Testing  ",
    Scores: [
      {
        Relevance: "2",
        Clarity: "3",
        Depth: "1",
        Coherence: "2",
        Language: "3",
        TechnicalAccuracy: "1",
        Creativity: "1",
      },
    ],
  },
];

const CandidatesPage: React.FC = () => {
  const [scheduledInterviews, setScheduledInterviews] = useState<
    ScheduledInterview[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(8);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCandidateReport, setSelectedCandidateReport] = useState<
    Report[]
  >([]);


  const searchParams = useSearchParams();
    const interviewId = searchParams.get("interview");

    useEffect(() => {
      const fetchScheduledInterviews = async () => {
        try {
          const token = localStorage.getItem("token");
          if (interviewId && token) {
            const response = await axios.get(
              `https://metashotbackend.azurewebsites.net/interview/schedule?interview=${interviewId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setScheduledInterviews(response.data);
          } else {
            console.log("No interview ID or token provided.");
          }
        } catch (error) {
          console.error("Error fetching scheduled interviews:", error);
        }
      };

      fetchScheduledInterviews();
    }, [interviewId]);
    
  const CandidatesContent = () => {
    

    const handleViewScores = (report: Report[]) => {
      setSelectedCandidateReport(report);
      setIsModalVisible(true);
    };

    const handleDeleteCandidate = async (email: string) => {
      try {
        const token = localStorage.getItem("token");
        if (interviewId && token) {
          // Find the scheduled interview containing the candidate
          const scheduledInterview = scheduledInterviews.find(interview =>
            interview.candidates.includes(email)
          );
    
          if (scheduledInterview) {
            // Extract the scheduled interview ID
            const { _id: interviewScheduleId } = scheduledInterview;
    
            // Call the API to delete the candidate
            await axios.put(
              "https://metashotbackend.azurewebsites.net/interview/schedule/candidates",
              {
                interviewScheduleId,
                candidate: email,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
    
            // After deletion, fetch updated scheduled interviews
            const response = await axios.get(
              `https://metashotbackend.azurewebsites.net/interview/schedule?interview=${interviewId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setScheduledInterviews(response.data);
          } else {
            console.log("Scheduled interview not found for candidate:", email);
          }
        } else {
          console.log("No interview ID or token provided.");
        }
      } catch (error) {
        console.error("Error deleting candidate:", error);
      }
    };
    

    const handleClickOutside = (event: React.MouseEvent) => {
      if ((event.target as Element).classList.contains(styles.modalOverlay)) {
        setIsModalVisible(false);
      }
    };

    // Flattening candidates from scheduled interviews
    const candidates = scheduledInterviews.flatMap((interview) =>
      interview.candidates.map((candidate) => ({
        email: candidate,
        start: interview.start,
        end: interview.end,
      }))
    );

    // Pagination logic
    const totalPages = Math.ceil(candidates.length / candidatesPerPage);
    const indexOfLastCandidate = currentPage * candidatesPerPage;
    const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
    const currentCandidates = candidates.slice(
      indexOfFirstCandidate,
      indexOfLastCandidate
    );

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
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className="font-semibold text-center text-black">Candidates</h1>
          <button className={styles.sortButton}>Sort: A-Z</button>
        </div>
        <div className={styles.candidatesTable}>
          <table className={styles.candidateTable}>
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Score</th>
                <th>Notes</th>
                <th>Review Interview</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCandidates.length > 0 ? (
                currentCandidates.map((candidate) => (
                  <tr key={candidate.email}>
                    <td>{candidate.email}</td>
                    <td>
                      <button onClick={() => handleViewScores(mockReport)}>
                        View Scores
                      </button>
                    </td>
                    <td>--</td>
                    <td>--</td>
                    <td>{new Date(candidate.start).toLocaleString()}</td>
                    <td>{new Date(candidate.end).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteCandidate(candidate.email)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>No candidates found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <button onClick={prevPage} disabled={currentPage === 1}>
            &lt;
          </button>
          <span>
            Page: {currentPage}/{totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </div>

        {isModalVisible && (
          <div className={styles.modalOverlay} onClick={handleClickOutside}>
            <div className={styles.modalContent}>
              <button
                className={styles.closeButton}
                onClick={() => setIsModalVisible(false)}
              >
                X
              </button>
              <h2 className={styles.modalTitle}>Candidate Scores</h2>
              <div className={styles.modalBody}>
                {selectedCandidateReport.map((topicReport, index) => (
                  <div key={index} className={styles.topic}>
                    <h3 className={styles.topicTitle}>{topicReport.Topic}</h3>
                    <table className={styles.scoreTable}>
                      <thead>
                        <tr>
                          {Object.keys(topicReport.Scores[0]).map(
                            (scoreKey, idx) => (
                              <th key={idx}>{scoreKey}</th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {topicReport.Scores.map((score, idx) => (
                          <tr key={idx}>
                            {Object.values(score).map((value, valueIdx) => (
                              <td key={valueIdx}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <NavbarN company="Metashot" user_name="Metashot" />
      <div className={styles.mainContent}>
        <SidebarN />
        <Suspense fallback={<div>Loading...</div>}>
          <CandidatesContent />
        </Suspense>
      </div>
    </div>
  );
};

export default CandidatesPage;
