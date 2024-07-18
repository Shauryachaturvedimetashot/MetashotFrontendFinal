"use client";
import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

import NavbarN from "../../Components/Navbarn";
import SidebarN from "../../Components/SidebarN";
import styles from "./Candidates.module.css";
import Navbar from "../../Components/Navbarn";

interface Candidate {
  email: string;
  name: string;
  start: string;
  end: string;
}

interface ScheduledInterview {
  _id: string;
  start: string;
  end: string;
  candidates: Candidate[];
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

// Processed Report
interface ProcessedReport {
  Topic: string;
  Technical: number;
  NonTechnical: number;
  TotalScore: number;
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

// Normalize Scores
const normalizeScore = (score: number, maxScore: number): number => {
  return (score / maxScore) * 20;
};

// Average the arrays
const calculateAverage = (scores: number[]): number => {
  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
};

// Process Mock Report
const processReport = (
  report: Report[]
): { overall: { Technical: number; NonTechnical: number }; topics: ProcessedReport[] } => {
  const processedTopics = report.map((topicReport) => {
    const scores = topicReport.Scores[0];
    const technicalScores = [
      normalizeScore(parseInt(scores.Relevance), 10),
      normalizeScore(parseInt(scores.Clarity), 15),
      normalizeScore(parseInt(scores.Depth), 25),
      normalizeScore(parseInt(scores.Coherence), 10),
      normalizeScore(parseInt(scores.TechnicalAccuracy), 45),
    ];
    const nonTechnicalScores = [
      normalizeScore(parseInt(scores.Language), 10),
      normalizeScore(parseInt(scores.Creativity), 15),
      normalizeScore(parseInt(scores.Coherence), 10),
    ];

    const technicalAverage = calculateAverage(technicalScores);
    const nonTechnicalAverage = calculateAverage(nonTechnicalScores);
    const totalScore = calculateAverage([technicalAverage, nonTechnicalAverage]);

    return {
      Topic: topicReport.Topic,
      Technical: technicalAverage,
      NonTechnical: nonTechnicalAverage,
      TotalScore: totalScore,
    };
  });

  const overallTechnical = calculateAverage(processedTopics.map((topic) => topic.Technical));
  const overallNonTechnical = calculateAverage(processedTopics.map((topic) => topic.NonTechnical));

  return {
    overall: {
      Technical: overallTechnical,
      NonTechnical: overallNonTechnical,
    },
    topics: processedTopics,
  };
};

// const processedReport = processReport(mockReport)

const CandidatesPage: React.FC = () => {
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(8);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Replacing this with process Report function
  const [selectedCandidateReport, setSelectedCandidateReport] = useState<ProcessedReport[]>([]);
  const [overallScores, setOverallScores] = useState<{ Technical: number; NonTechnical: number } | null>(null);
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interview");

  useEffect(() => {
    const fetchScheduledInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (interviewId && token) {
          const response = await axios.get(
            `https://metashot-backend.azurewebsites.net/interview/schedule?interview=${interviewId}`,
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

  const handleViewScores = (report: Report[]) => {
    const processedReport = processReport(report);
    setSelectedCandidateReport(processedReport.topics);
    setOverallScores(processedReport.overall);
    setIsModalVisible(true);
  };

  const handleDeleteCandidate = async (email: string) => {
    try {
      const token = localStorage.getItem("token");
      if (interviewId && token) {
        const scheduledInterview = scheduledInterviews.find((interview) =>
          interview.candidates.some((candidate) => candidate.email === email)
        );

        if (scheduledInterview) {
          const { _id: interviewScheduleId } = scheduledInterview;

          await axios.put(
            "https://metashot-backend.azurewebsites.net/interview/schedule/candidates",
            {
              interviewScheduleId,
              candidate: email,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const response = await axios.get(
            `https://metashot-backend.azurewebsites.net/interview/schedule?interview=${interviewId}`,
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
    if (event.target instanceof Element && event.target.closest(`.${styles.modalOverlay}`)) {
      setIsModalVisible(false);
    }
  };

  const candidates = scheduledInterviews.flatMap((interview) =>
    interview.candidates.map((candidate) => ({
      email: candidate.email,
      name: candidate.name,
      start: interview.start,
      end: interview.end,
    }))
  );

  const totalPages = Math.ceil(candidates.length / candidatesPerPage);
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = candidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

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
    <div className="flex flex-col w-screen h-screen">
      <div className="flex flex-row">
        <Navbar />
      </div>
      <div className="flex flex-row">
        <div className="w-1/5">
          <SidebarN />
        </div>
        <div className="flex-1 overflow-auto">
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>Candidates List</h1>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCandidates.map((candidate) => (
                  <tr key={candidate.email}>
                    <td>{candidate.email}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.start}</td>
                    <td>{candidate.end}</td>
                    <td>
                      <button
                        onClick={() => handleViewScores(mockReport)}
                        className={styles.viewScoresButton}
                      >
                        View Scores
                      </button>
                      <button
                        onClick={() => handleDeleteCandidate(candidate.email)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <button onClick={prevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>{currentPage}</span>
              <button onClick={nextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {isModalVisible && (
        <div className={styles.modalOverlay} onClick={handleClickOutside}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Candidate Scores</h2>
            {overallScores && (
              <div>
                <h3>Overall Scores</h3>
                <p>Technical: {overallScores.Technical.toFixed(2)}</p>
                <p>Non-Technical: {overallScores.NonTechnical.toFixed(2)}</p>
              </div>
            )}
            <table className={styles.scoresTable}>
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Technical</th>
                  <th>Non-Technical</th>
                  <th>Total Score</th>
                </tr>
              </thead>
              <tbody>
                {selectedCandidateReport.map((topic) => (
                  <tr key={topic.Topic}>
                    <td>{topic.Topic}</td>
                    <td>{topic.Technical.toFixed(2)}</td>
                    <td>{topic.NonTechnical.toFixed(2)}</td>
                    <td>{topic.TotalScore.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setIsModalVisible(false)} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};




const CandidatesPageWithSuspense: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CandidatesPage />
  </Suspense>
);

export default CandidatesPageWithSuspense;
