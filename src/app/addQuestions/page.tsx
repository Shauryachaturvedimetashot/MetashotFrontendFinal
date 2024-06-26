"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

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
  const [initialSkills, setInitialSkills] = useState<string[]>([]);

  useEffect(() => {
    const storedSkillsStr = localStorage.getItem("skills");
    if (storedSkillsStr) {
      const storedSkills = JSON.parse(storedSkillsStr);
      setInitialSkills(storedSkills);
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

  const handleQuestionDelete = (index: number) => {
    if (selectedCategory !== null) {
      const updatedCategories = [...categories];
      const categoryIndex = updatedCategories.findIndex((cat) => cat.name === selectedCategory);
      if (categoryIndex !== -1) {
        updatedCategories[categoryIndex].questions.splice(index, 1);
        setCategories(updatedCategories);
      }
    }
  };

  const handleEditClick = (index: number) => {
    if (selectedCategory !== null) {
      const categoryIndex = categories.findIndex((cat) => cat.name === selectedCategory);
      if (categoryIndex !== -1) {
        setNewQuestion(categories[categoryIndex].questions[index]);
        setEditIndex(index);
      }
    }
  };

  const handleCategorySelection = (categoryName: string) => {
    setSelectedCategory(categoryName);
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

  const handleGenerateQuestions = () => {
    const generatedData = [
      { skill: "Java", question: "What is a constructor in Java?" },
      { skill: "Python", question: "How do you define a function in Python?" },
      { skill: "JavaScript", question: "What is a closure in JavaScript?" },
    ];

    const updatedCategories = [...categories];

    generatedData.forEach((data) => {
      const categoryIndex = updatedCategories.findIndex((cat) => cat.name === data.skill);
      if (categoryIndex !== -1) {
        updatedCategories[categoryIndex].questions.push(data.question);
      } else {
        updatedCategories.push({ name: data.skill, questions: [data.question] });
      }
    });

    setCategories(updatedCategories);
  };

  const handleFinishButtonClick = async () => {
    try {
      const formData = JSON.parse(localStorage.getItem("formData") || "{}");
      const technicalSkills = formData.technicalSkills || initialSkills;

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

      const response = await axios.post("https://metashotbackend.azurewebsites.net/interview/create", payload, { headers });

      if (response.status === 200) {
        console.log("Interview created successfully:", response.data);
        window.location.href = "/PastInterviews";
      } else {
        console.error("Failed to create interview:", response.data);
      }
    } catch (error) {
      console.error("Error creating interview:", error);
    }
  };

  // Remove duplicates from initialSkills and categories
  const allSkills = Array.from(new Set([...initialSkills, ...categories.map(cat => cat.name)]));

  return (
    <div className="flex flex-col items-center justify-center bg-green-100 min-h-screen relative">
      <div className="absolute top-4 left-4 text-black">
        <Link href="/InterviewForm">← Back</Link>
      </div>
      <h1 className="text-3xl font-semibold mb-4 text-center text-black">Questions</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4" onClick={handleGenerateQuestions}>
        Generate Using AI
      </button>
      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2 text-black">Add Specific Questions</h2>
        <textarea
          className="border border-gray-300 rounded px-3 py-2 mb-2 w-full focus:outline-none focus:border-blue-400 text-black"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Type your question here..."
        />
        <div className="mb-2">
          <label className="text-sm font-semibold text-black">Select or Add Skill:</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 text-black"
            value={selectedCategory || ""}
            onChange={(e) => handleCategorySelection(e.target.value)}
          >
            <option value="">Select Skill or Add New</option>
            {allSkills.map((skill, index) => (
              <option key={index} value={skill}>{skill}</option>
            ))}
          </select>
          <input
            type="text"
            className="border border-gray-300 rounded px-3 py-2 mt-2 w-full focus:outline-none focus:border-blue-400 text-black"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Skill Name"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
            onClick={handleAddCategory}
          >
            Add Skill
          </button>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          onClick={addOrUpdateQuestion}
        >
          {editIndex !== null ? "Update Question" : "Add Question"}
        </button>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-black">Added Questions for {selectedCategory}</h2>
          <ul>
            {categories
              .find((cat) => cat.name === selectedCategory)
              ?.questions.map((question, index) => (
                <li key={index} className="border border-gray-300 rounded px-3 py-2 mb-2 text-black">
                  {question}
                  <button
                    className="ml-2 text-sm text-red-600"
                    onClick={() => handleQuestionDelete(index)}
                  >
                    Delete
                  </button>
                  <button
                    className="ml-2 text-sm text-blue-600"
                    onClick={() => handleEditClick(index)}
                  >
                    Edit
                  </button>
                </li>
              ))}
          </ul>
        </div>
        {showDeleteConfirmation && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg text-center">
              <p className="mb-4">Are you sure you want to delete {categoryToDelete}?</p>
              <div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                  onClick={handleConfirmDelete}
                >
                  Yes
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
                  onClick={handleCancelDelete}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
          onClick={handleFinishButtonClick}
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default AskQuestions;
