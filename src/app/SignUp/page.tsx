"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "../../utils/axiosSetup"; // Importing axios setup

const LoginSignUpPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
      const res = await apiClient.post(`/user/${isSignUp ? "register" : "login"}`, {
        email,
        password,
        ...(isSignUp && { name: companyname, type }),
      });

      if (res.status === 400) {
        setError(isSignUp ? "This Email is already in use" : "Invalid credentials");
      } else if (res.status === 201 || res.status === 200) {
        setError("");
        // Assuming the token is returned in the response
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        if (!isSignUp && user && user.name) {
          localStorage.setItem('companyName', user.name);
        } else if (isSignUp) {
          localStorage.setItem('companyName', companyname);
        }
        router.push("/Jobs");
      }
    } catch (err) {
      setError("Error, Please try again");
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-green-700 items-center">
      <div className="flex flex-wrap justify-between items-center p-8 w-full max-w-screen-xl mx-auto">
        <div className="flex-1 flex flex-col justify-center items-start p-4 md:p-8 max-w-lg"> {/* Adjusted padding from p-8 to p-4 on small screens and p-8 on medium and larger screens */}
          <img
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Descriptive Alt Text"
            className="mb-4 rounded"
            style={{ width: "100%", height: "auto", objectFit: "cover" }}
          />
          <div className="text-white text-left">
            <h1 className="text-3xl font-bold">The Smartest AI Interviewer</h1>
            <p className="mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center p-4 md:p-8 bg-white rounded-lg shadow-md w-full max-w-md"> {/* Adjusted padding from p-8 to p-4 on small screens and p-8 on medium and larger screens */}
          <h1 className="text-3xl text-center font-semibold mb-8 text-black">{isSignUp ? "SignUp" : "Log in to your account"}</h1>
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <input
              type="text"
              className="w-full border border-gray-300 text-black bg-white rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-400"
              placeholder="Email"
              required
            />
            <input
              type="password"
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
                    Company
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
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
            >
              {isSignUp ? "SignUp" : "Login"}
            </button>
            <p className="text-red-600 text-[16px] mt-2"> {error && error} </p> {/* Adjusted margin to mt-2 */}
          </form>
          <div className="text-center text-gray-500 mt-4">-OR-</div>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="block text-center text-blue-500 hover:underline mt-2"
          >
            {isSignUp ? "Login with an existing account" : "New user?  Sign up Here"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUpPage;
