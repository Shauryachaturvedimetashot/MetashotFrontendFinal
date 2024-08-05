"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "../../utils/axiosSetup"; // Importing axios setup
import axios from "axios";

const LoginSignUpPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [secret, setSecret] = useState(true);

  const toggleSecret = () => {
    setSecret(!secret);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    let companyname = "";
    let type = "";

    if (isSignUp) {
      companyname = e.target[2].value;
      type = e.target[3].value;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email");
      return;
    }
    if (!password || password.length < 8) {
      setError("Invalid password. It should have at least 8 characters");
      return;
    }

    try {
      const res = await apiClient.post(`/user/${isSignUp ? "register" : "login"}`, { // Corrected the template literal usage
        email,
        password,
        ...(isSignUp && { name: companyname, type }), // Spread operator usage corrected
      });

      if (res.status === 400) {
        setError(isSignUp ? "This Email is already in use" : "Invalid credentials");
      } else if (res.status === 201 || res.status === 200) {
        setError("");
        // Assuming the token is returned in the response
        const token = res.data.token;
        localStorage.setItem('token', token);
        const response =  await axios.post("/api/users/setAuth", { token });
        console.log(response.data);
        
        router.push("/Jobs");
      }
    } catch (err) {
      setError("Error, Please try again");
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <div className="hidden lg:flex-1 lg:flex flex-col justify-center items-center p-8">
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Descriptive Alt Text"
          className="w-full h-auto mb-4 rounded"
          style={{ maxHeight: "80vh", objectFit: "cover" }}
        />
      </div>
      {/* SignUp/Login Component */}
      <div className="flex-1 lg:flex-grow-0 min-w-96 h- flex-col justify-center items-center p-8" >
        <div className="bg-white bg-glassmorphic-gradient bg-opacity-10 backdrop-blur-lg  p-8 rounded-lg shadow-xl w-full h-full flex flex-col flex-1 justify-between">
          <h1 className="text-3xl text-center font-semibold mb-8 text-black">{isSignUp ? "SignUp" : "Login"}</h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="text"
              className="w-full border border-gray-300 text-black bg-white rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400"
              placeholder="Email"
              required
            />
            <input
              type={secret?"password":"text"}
              className="w-full border border-gray-300 text-black bg-white rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400"
              placeholder="Password"
              required
            />
            {isSignUp && (
              <>
                <input
                  type="text"
                  className="w-full border border-gray-300 text-black bg-white rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400"
                  placeholder="Name of the company"
                  required
                />
                <div className="mb-4">
                  <input
                    type="radio"
                    id="company"
                    name="userType"
                    value="Company"
                    className="mr-2"
                  />
                  <label htmlFor="company" className="text-black mr-4">
                    company
                  </label>
                  <input
                    type="radio"
                    id="agency"
                    name="userType"
                    value="Agency"
                    className="mr-2"
                  />
                  <label htmlFor="agency" className="text-black">
                    Agency
                  </label>
                </div>
              </>
            )}
            {!isSignUp && (
              <div className="flex justify-end mb-4">
                <Link href="/forgot-password" className="text-blue-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-800"
            >
              {isSignUp ? "SignUp" : "Login"}
            </button>
            <p className="text-red-600 text-[16px] mb-4"> {error && error} </p>
          </form>
          <div className="text-center text-gray-500 mt-4">-OR-</div>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="block text-center text-blue-500 hover:underline mt-2"
          >
            {isSignUp ? "Login with an existing account" : "Create a new account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUpPage;
