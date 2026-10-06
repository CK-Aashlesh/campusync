'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsSubmitting(true);
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/reset-password/${params.token}`, { password });
      
      // Auto login with new token
      Cookies.set('token', res.data.token, { expires: 30 });
      setMessage('Password reset successful. Redirecting...');
      
      setTimeout(() => {
        router.push('/');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing request');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9edf5] flex items-center justify-center p-3 sm:p-6 lg:p-10 antialiased font-sans">
      {/* Main Card Container */}
      <div className="w-full max-w-[1040px] bg-white rounded-[24px] sm:rounded-[36px] shadow-[0_25px_60px_-15px_rgba(15,45,115,0.18)] overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Left Side: Blue Gradient Section */}
        <div className="relative w-full lg:w-[48%] xl:w-[46%] bg-gradient-to-br from-[#1c69e6] via-[#1658cd] to-[#0c44b0] text-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-0 min-h-[270px] sm:min-h-[320px] lg:min-h-[580px]">
          
          <div className="relative z-10 text-center lg:text-left">
            <p className="text-white/90 text-base sm:text-xl font-normal tracking-wide">
              Complete Account Recovery
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center my-3 sm:my-6 lg:my-0">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white shadow-xl flex items-center justify-center relative transform hover:scale-105 transition-transform duration-300">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-[#1658cd]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div className="mt-4 sm:mt-6 text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2">
                CampuSync
              </h1>
              <p className="text-sm sm:text-base text-blue-200 font-medium tracking-wide">
                Set a strong password
              </p>
            </div>
          </div>

          <div className="relative z-10 text-center lg:text-left text-xs sm:text-sm text-blue-200 font-medium">
            <p>© {new Date().getFullYear()} CampuSync. All rights reserved.</p>
          </div>

          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-blue-900 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full lg:w-[52%] xl:w-[54%] p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center bg-white z-10 relative">
          
          <div className="mb-6 sm:mb-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-black tracking-tight mb-2 sm:mb-3">
              Reset Password
            </h2>
            <p className="text-sm sm:text-base text-black font-medium leading-relaxed">
              Enter your new credentials below.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-semibold flex items-start sm:items-center space-x-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm font-semibold flex items-start sm:items-center space-x-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5 sm:space-y-6">
            
            {/* New Password Field */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-black mb-1.5">
                New Password
              </label>
              <div className="relative flex items-center border-b border-gray-300 focus-within:border-blue-600 transition-colors duration-200">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2 sm:py-2.5 pr-14 bg-transparent text-black placeholder-black text-sm focus:outline-none"
                />
                <div className="absolute right-1 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="text-black hover:text-black transition-colors focus:outline-none p-0.5"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    )}
                  </button>
                  <span className={`transition-colors duration-200 ${password.length > 0 ? 'text-blue-600' : 'text-sky-300 group-focus-within:text-blue-400'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-black mb-1.5">
                Confirm Password
              </label>
              <div className="relative flex items-center border-b border-gray-300 focus-within:border-blue-600 transition-colors duration-200">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full py-2 sm:py-2.5 pr-14 bg-transparent text-black placeholder-black text-sm focus:outline-none"
                />
                <div className="absolute right-1 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="text-black hover:text-black transition-colors focus:outline-none p-0.5"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    )}
                  </button>
                  <span className={`transition-colors duration-200 ${confirmPassword.length > 0 ? (confirmPassword === password ? 'text-green-500' : 'text-red-500') : 'text-sky-300 group-focus-within:text-blue-400'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4">
              <button
                type="submit"
                disabled={isSubmitting || message.includes('successful')}
                className="w-full min-w-[135px] px-9 py-2.5 rounded-full bg-gradient-to-r from-[#1761de] to-[#2372f8] text-white font-medium text-sm shadow-[0_6px_20px_rgba(23,97,222,0.35)] hover:shadow-[0_8px_25px_rgba(23,97,222,0.45)] hover:from-[#1355c7] hover:to-[#1f68e3] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
