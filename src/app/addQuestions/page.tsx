"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbarn from "../../Components/Navbarn";
import Sidebarn from "../../Components/SidebarN";

interface Category {
  name: string;
  questions: string[];
}

const AskQuestions = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState<string>("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string>("");

  useEffect(() => {
    const storedSkillsStr = localStorage.getItem("skills");
    if (storedSkillsStr) {
      const storedSkills = JSON.parse(storedSkillsStr);
      setCategories(storedSkills.map((skill: string) => ({ name: skill, questions: [] })));
    }
  }, []);

  const addOrUpdateQuestion = () => {
    if (newQuestion.trim() !== "" && selectedCategory !== null) {
      if (editIndex !== null) {
        const updatedCategories = [...categories];
        const categoryIndex = updatedCategories.findIndex((cat) => cat.name === selectedCategory);
        if (categoryIndex !== -1) {
          updatedCategories[categoryIndex].questions[editIndex] = newQuestion;
          setCategories(updatedCategories);
          setEditIndex(null);
        }
      } else {
        const updatedCategories = [...categories];
        const categoryIndex = updatedCategories.findIndex((cat) => cat.name === selectedCategory);
        if (categoryIndex !== -1) {
          updatedCategories[categoryIndex].questions.push(newQuestion);
        }
        setCategories(updatedCategories);
      }
      setNewQuestion("");
    }
  };

  const handleQuestionDelete = (categoryName: string, index: number) => {
    const updatedCategories = [...categories];
    const categoryIndex = updatedCategories.findIndex((cat) => cat.name === categoryName);
    if (categoryIndex !== -1) {
      updatedCategories[categoryIndex].questions.splice(index, 1);
      setCategories(updatedCategories);
    }
  };

  const handleEditClick = (categoryName: string, index: number) => {
    const categoryIndex = categories.findIndex((cat) => cat.name === categoryName);
    if (categoryIndex !== -1) {
      setNewQuestion(categories[categoryIndex].questions[index]);
      setEditIndex(index);
    }
  };

  const handleCategorySelection = (categoryName: string) => {
    setSelectedCategory(categoryName === "__all__" ? null : categoryName);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      const categoryExists = categories.some((cat) => cat.name === newCategory);
      if (!categoryExists) {
        setCategories([...categories, { name: newCategory, questions: [] }]);
        setSelectedCategory(newCategory);
      }
      setNewCategory("");
    }
  };

  const handleDeleteConfirmation = (categoryName: string) => {
    setCategoryToDelete(categoryName);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    const updatedCategories = categories.filter((cat) => cat.name !== categoryToDelete);
    setCategories(updatedCategories);
    setSelectedCategory(null);
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setCategoryToDelete("");
  };

  const handleGenerateQuestions = async () => {
    if (!selectedCategory) return;

    try {
      const formData = JSON.parse(localStorage.getItem("formData") || "{}");
      const jobRole = formData.jobPosition || "Job Role Not Defined"; // Fallback if jobPosition is not set

      const response = await axios.post("https://metashot-backend.azurewebsites.net/ai/generateQuestion", {
        jobRole,
        topic: selectedCategory,
      });

      if (response.status === 200 && response.data.question) {
        const updatedCategories = [...categories];
        const categoryIndex = updatedCategories.findIndex((cat) => cat.name === selectedCategory);
        if (categoryIndex !== -1) {
          updatedCategories[categoryIndex].questions.push(response.data.question);
        } else {
          updatedCategories.push({ name: selectedCategory, questions: [response.data.question] });
        }
        setCategories(updatedCategories);
      } else {
        console.error("Failed to generate question:", response.data);
      }
    } catch (error) {
      console.error("Error generating question:", error);
      alert("Error generating question. Please try again.");
    }
  };

  const handleFinishButtonClick = async () => {
    try {
      const formData = JSON.parse(localStorage.getItem("formData") || "{}");
      const technicalSkills = formData.technicalSkills || categories.map(cat => cat.name);
      const jobDescription = formData.jobDescription || "";
      localStorage.setItem("jobDescription", jobDescription);
      const jobPosition = formData.jobPosition || "";
      localStorage.setItem("jobPosition", jobPosition);

      const payload = {
        jobPosition: formData.jobPosition || "",
        yearsOfExperience: formData.yearsOfExperience || "",
        jobDescription: formData.jobDescription || "",
        technicalSkills,
        questions: categories.map((cat) => ({
          skill: cat.name,
          questions: cat.questions,
        })),
      };

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token not found.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post("https://metashot-backend.azurewebsites.net/interview/create", payload, { headers });

      if (response.status === 200) {
        console.log("Interview created successfully:", response.data);
        const interviewId = response.data._id; // Extract interview ID from response
        window.location.href = `/Invite?interview=${interviewId}`; // Redirect to CandidateScreen with interview ID
      } else {
        console.error("Failed to create interview:", response.data);
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      alert("Error creating interview. Please fill out the details correctly.");
    }
  };

  // Render questions based on selectedCategory or all categories
  const renderedQuestions = selectedCategory !== null
    ? categories.find(cat => cat.name === selectedCategory)?.questions || []
    : categories.reduce((acc: string[], cat) => [...acc, ...cat.questions], []);

  return (
    <div className="min-h-screen bg-green-100">
      <Navbarn />
      <div className="flex">
        <Sidebarn />
        <div className="flex-1 p-4">
          <div className="mb-4">
            <div className="flex">
              <div className="w-1/2 pr-4">
                <h2 className="mb-2 text-lg font-semibold text-black">Add Specific Questions</h2>
                <textarea
                  className="w-full px-3 py-2 mb-2 text-black border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type your question here..."
                />
                <div className="mb-2">
                  <label className="text-sm font-semibold text-black">Select or Add Skill:</label>
                  <select
                    className="w-full px-3 py-2 text-black border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    value={selectedCategory || "__all__"}
                    onChange={(e) => handleCategorySelection(e.target.value)}
                  >
                    <option value="__all__">Show All</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="w-full px-3 py-2 mt-2 text-black border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Skill Name"
                  />
                </div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="mb-4 overflow-y-auto max-h-96"> {/* Increased height to 80px */}
                  <h2 className="mb-2 text-lg font-semibold text-black">Added Questions</h2>
                  <ul>
                    {categories.flatMap((cat, catIndex) =>
                      cat.questions.map((question, index) => (
                        <li key={`${catIndex}-${index}`} className="px-3 py-2 mb-2 text-black border border-gray-300 rounded">
                          (<span style={{ fontWeight: '600' }}>{cat.name}</span>
                          ) {question} 
                          <button
                            className="ml-2 text-red-500"
                            onClick={() => handleQuestionDelete(cat.name, index)}
                          >
                            Delete
                          </button>
                          <button
                            className="ml-2 text-blue-500"
                            onClick={() => handleEditClick(cat.name, index)}
                          >
                            Edit
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex">
              <button
                className="px-4 py-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
                onClick={addOrUpdateQuestion}
              >
                {editIndex !== null ? "Update Question" : "Add Question"}
              </button>
              <button
                className="px-4 py-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
                onClick={handleAddCategory}
              >
                Add Skill
              </button>
              <button
                className="px-4 py-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
                onClick={handleGenerateQuestions}
              >
                Generate Using AI
              </button>
              <button
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                onClick={handleFinishButtonClick}
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed top-0 left-0 right-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded shadow-md">
            <p>Are you sure you want to delete the skill &quot;{categoryToDelete}&quot;?</p>
            <div className="mt-4">
              <button
                className="px-4 py-2 mr-2 text-white bg-red-500 rounded hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskQuestions;

