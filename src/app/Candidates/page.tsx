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

//Processed Report
interface ProcessedReport {
  Topic: string;
  Technical: string;
  NonTechnical: string;
  TotalScore: string;
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
}

//Average the arrays
const calculateAverage = (scores: number[]): number => {
  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
}

//Process Mock Report
const processReport = (report: Report[]): ProcessedReport[] => {
  return report.map((topicReport) => {
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
    const totalScore = calculateAverage([
      technicalAverage,
      nonTechnicalAverage,
    ]);

    return {
      Topic: topicReport.Topic,
      Technical: technicalAverage.toFixed(2),
      NonTechnical: nonTechnicalAverage.toFixed(2),
      TotalScore: totalScore.toFixed(2),
    };
  });
}

const processedReport = processReport(mockReport)






const CandidatesPage: React.FC = () => {
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(8);
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Replacing this with process Report function
  const [selectedCandidateReport, setSelectedCandidateReport] = useState<ProcessedReport[]>([]);
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

  const handleViewScores = (report: ProcessedReport[]) => {
    setSelectedCandidateReport(report);
    setIsModalVisible(true);
  };

  const handleDeleteCandidate = async (email: string) => {
    try {
      const token = localStorage.getItem("token");
      if (interviewId && token) {
        const scheduledInterview = scheduledInterviews.find((interview) =>
          interview.candidates.includes(email)
        );

        if (scheduledInterview) {
          const { _id: interviewScheduleId } = scheduledInterview;

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
    if (event.target instanceof Element && event.target.closest(`.${styles.modalOverlay}`)) {
      setIsModalVisible(false);
    }
  };
  
  
  

  // const candidates = scheduledInterviews.flatMap((interview) =>
  //   interview.candidates.map((candidate) => ({
  //     email: candidate,
  //     start: interview.start,
  //     end: interview.end,
  //   }))
  // );

  const candidates = [
    {
      email: "test1@test.com",
      start: "2022-11-11",
      end: "2022-11-11",
    },
    {
      email: "test2@test.com",
      start: "2022-11-11",
      end:"2022-11-11"
      }
    
  ]

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
      <Navbar user_name="Metashot" company="Metashot" />
      </div>
      <div className="flex flex-row">
        <div className="w-1/5">
          <SidebarN />
        </div>
        <div className="flex-1 overflow-auto">
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
                  {currentCandidates.length >= 0 ? (
                    currentCandidates.map((candidate) => (
                      <tr key={candidate.email}>
                        <td>{candidate.email}</td>
                        <td>
                          <button onClick={() => handleViewScores(processedReport)}>
                            View Scores
                          </button>
                        </td>
                        <td>--</td>
                        <td>--</td>
                        {/* <td>{new Date(candidate.start).toLocaleString()}</td> */}
                        <td>{candidate.start}</td>
                        {/* <td>{new Date(candidate.end).toLocaleString()}</td> */}
                        <td> {candidate.end}</td>
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

            {/* {isModalVisible && (
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
                      <div key={index} className={styles.topicReport}>
                        <h3>{topicReport.Topic}</h3>
                        <table className={styles.scoresTable}>
                          <thead>
                            <tr>
                              <th>Relevance</th>
                              <th>Clarity</th>
                              <th>Depth</th>
                              <th>Coherence</th>
                              <th>Language</th>
                              <th>Technical Accuracy</th>
                              <th>Creativity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topicReport.Scores.map((score, scoreIndex) => (
                              <tr key={scoreIndex}>
                                <td>{score.Relevance}</td>
                                <td>{score.Clarity}</td>
                                <td>{score.Depth}</td>
                                <td>{score.Coherence}</td>
                                <td>{score.Language}</td>
                                <td>{score.TechnicalAccuracy}</td>
                                <td>{score.Creativity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )} */}

{isModalVisible && (
        <div
          className={`${styles.modalOverlay} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
          onClick={handleClickOutside}
        >
          <div className="bg-white p-6 rounded-lg w-2/3 h-3/4 overflow-auto text-black">
            <h2 className="text-xl font-semibold mb-4">Candidate Scores</h2>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Topic</th>
                  <th className="py-2 px-4 border-b">Technical Score</th>
                  <th className="py-2 px-4 border-b">Non-Technical Score</th>
                  <th className="py-2 px-4 border-b">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {selectedCandidateReport.map((report, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{report.Topic}</td>
                    <td className="py-2 px-4 border-b">{report.Technical}</td>
                    <td className="py-2 px-4 border-b">{report.NonTechnical}</td>
                    <td className="py-2 px-4 border-b">{report.TotalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setIsModalVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}


            
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidatesPageWithSuspense: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CandidatesPage />
  </Suspense>
);

export default CandidatesPageWithSuspense;
