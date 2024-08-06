"use client"
import apiClient from '@/src/utils/axiosSetup';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);

        try {
            const res = await apiClient.post('/user/forgot-password', { email });
            // const res = await axios.post('http://localhost:8000/user/forgot-password', { email });
            setMessage("If an account exists for this email, you will receive a password reset link shortly.");
            setTimeout(() => router.push('/SignUp'), 5000);
        } catch (err: any) {
            console.error(err);
            setMessage(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-yellow-200 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#622A0F]">
                        Forgot Your Password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#622A0F] focus:border-[#622A0F] focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="text-sm text-center font-medium text-[#622A0F]">
                            {message}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#9e4e26e4] hover:bg-[#622A0F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9e4e26e4]"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <a href="/login" className="font-medium text-[#9e4e26e4] hover:text-[#622A0F]">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;