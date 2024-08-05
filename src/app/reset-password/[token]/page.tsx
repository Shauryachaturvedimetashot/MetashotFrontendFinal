"use client"
import apiClient from '@/src/utils/axiosSetup';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ResetPassword = ({ params }: { params: { token: string } }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const token = params.token;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);

        if (password.length < 8) {
            setMessage("Password should be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const res = await apiClient.post(`/user/reset-password/${token}`, { password });
            // const res = await axios.post(`http://localhost:8000/user/reset-password/${token}`, { password });
            setMessage("Password reset successfully. Redirecting to login...");
            setTimeout(() => router.push('/SignUp'), 3000);
        } catch (err) {
            console.error(err);
            setMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-yellow-200 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#9e4e26e4]">
                        Reset Your Password
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="password" className="sr-only">New Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#622A0F] focus:border-[#622A0F] focus:z-10 sm:text-sm"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">Confirm New Password</label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#622A0F] focus:border-[#622A0F] focus:z-10 sm:text-sm"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#a55730] hover:bg-[#622A0F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a55730]"
                        >
                            {isLoading ? 'Processing...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;