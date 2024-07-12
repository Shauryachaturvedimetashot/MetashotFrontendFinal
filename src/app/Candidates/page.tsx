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
}

//Average the arrays
const calculateAverage = (scores: number[]): number => {
  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
}

//Process Mock Report
const processReport = (report: Report[]): { overall: { Technical: number, NonTechnical: number }, topics: ProcessedReport[] } => {
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
    const totalScore = calculateAverage([
      technicalAverage,
      nonTechnicalAverage,
    ]);

    return {
      Topic: topicReport.Topic,
      Technical: technicalAverage,
      NonTechnical: nonTechnicalAverage,
      TotalScore: totalScore,
    };
  });

  const overallTechnical = calculateAverage(processedTopics.map(topic => topic.Technical));
  const overallNonTechnical = calculateAverage(processedTopics.map(topic => topic.NonTechnical));

  return {
    overall: {
      Technical: overallTechnical,
      NonTechnical: overallNonTechnical,
    },
    topics: processedTopics,
  };
}

// const processedReport = processReport(mockReport)






const CandidatesPage: React.FC = () => {
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(8);
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Replacing this with process Report function
  const [selectedCandidateReport, setSelectedCandidateReport] = useState<ProcessedReport[]>([]);

  const [overallScores, setOverallScores] = useState<{ Technical: number, NonTechnical: number } | null>(null);
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

  const handleViewScores = (report: Report[]) => {
    const processedReport = processReport(report)
    setSelectedCandidateReport(processedReport.topics);
    setOverallScores(processedReport.overall)
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
                          <button onClick={() => handleViewScores(mockReport)}>
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
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" onClick={handleClickOutside}>
    <div className="bg-[#EAFBEE] p-8  shadow-md w-full max-w-lg relative text-black font-spaceGrotesk rounded-md ">
      <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setIsModalVisible(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-semibold mb-4 text-center">Candidate Scores</h2>
      <div className="mb-4">
        {overallScores && (
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Overall Scores</h3>
            <div className="flex justify-around mb-4">
              <div>
                <h4 className="text-lg font-medium">Technical</h4>
                <p className="font-semibold">{overallScores.Technical.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-lg font-medium">Non-Technical</h4>
                <p className="font-semibold">{overallScores.NonTechnical.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
         <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-s  text-black uppercase tracking-wider border-r border-gray-300 font-bold">Topic</th>
                <th className="px-4 py-2 text-left text-s font-bold text-black uppercase tracking-wider">Total Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {selectedCandidateReport.map((topicReport, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-r border-gray-300">{topicReport.Topic}</td>
                  <td className="px-4 py-2">{topicReport.TotalScore.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center items-center ">
        <button className="w-[30%]  bg-green-500 p-1 rounded-md font-semibold">
          Detailed Report
        </button></div>
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
