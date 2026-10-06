'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Login failed. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9edf5] flex items-center justify-center p-3 sm:p-6 lg:p-10 antialiased font-sans">
      {/* Main Login Card Container */}
      <div className="w-full max-w-[1040px] bg-white rounded-[24px] sm:rounded-[36px] shadow-[0_25px_60px_-15px_rgba(15,45,115,0.18)] overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Left Side: Blue Gradient Section with Cloud Waves (Desktop) / Top Header (Mobile) */}
        <div className="relative w-full lg:w-[48%] xl:w-[46%] bg-gradient-to-br from-[#1c69e6] via-[#1658cd] to-[#0c44b0] text-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-0 min-h-[270px] sm:min-h-[320px] lg:min-h-[580px]">
          
          {/* Top Welcome Text */}
          <div className="relative z-10 text-center lg:text-left">
            <p className="text-white/90 text-base sm:text-xl font-normal tracking-wide">
              Welcome to
            </p>
          </div>

          {/* Center Circular Badge with Rocket & CampuSync Branding */}
          <div className="relative z-10 flex flex-col items-center my-3 sm:my-6 lg:my-0">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white shadow-xl flex items-center justify-center relative transform hover:scale-105 transition-transform duration-300">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 text-[#1658cd]"
                viewBox="0 0 80 80"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* Rocket Fin Left */}
                <path d="M29 46 L17 50 C14.5 50.8 14.2 54.2 16.5 55.4 L28 56.5 Z" />
                {/* Rocket Fin Right */}
                <path d="M46 29 L50 17 C50.8 14.5 54.2 14.2 55.4 16.5 L56.5 28 Z" />
                {/* Rocket Fuselage */}
                <path d="M60.5 19.5 C60.5 19.5 55.5 11 41 16.5 C34 19 25.5 27 21 37 C18 43.5 19 49 23 52.5 C26.5 56 32.5 57 39 54 C49 49.5 57 41 59.5 34 C65 19.5 60.5 19.5 60.5 19.5 Z" />
                {/* White Porthole Window */}
                <circle cx="43" cy="33" r="4.5" fill="white" />
                {/* Exhaust plume / tail flame */}
                <path d="M19 57 C16 60.5 14 64.5 15.5 67 C17 68.5 21 66.5 24.5 63.5 C25.5 62.5 22 59 19 57 Z" opacity="0.85" />
                {/* Sparkle Stars */}
                <path d="M62 45 L63.2 48.2 L66.5 49.5 L63.2 50.8 L62 54 L60.8 50.8 L57.5 49.5 L60.8 48.2 Z" opacity="0.9" />
                <path d="M23 18 L24 20.5 L26.5 21.5 L24 22.5 L23 25 L22 22.5 L19.5 21.5 L22 20.5 Z" opacity="0.9" />
              </svg>
            </div>
            {/* Title under rocket icon */}
            <h1 className="text-xl sm:text-3xl font-bold tracking-wide mt-3 text-white drop-shadow-sm">
              CampuSync
            </h1>
          </div>

          {/* Description & Footer */}
          <div className="relative z-10 flex flex-col items-center">
            <p className="text-white/80 text-xs sm:text-sm text-center leading-relaxed max-w-xs mb-3 sm:mb-6 font-light">
              Streamlined academic management, real-time attendance, and smart campus operations.
            </p>
            <div className="flex items-center space-x-3 text-[10px] sm:text-[11px] tracking-[0.25em] text-white/50 font-semibold uppercase">
              <span>KVGCE</span>
              <span>|</span>
              <span>CAMPUSYNC PORTAL</span>
            </div>
          </div>

          {/* Desktop Cloud Divider (Along the right edge of blue section) */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 h-full w-28 xl:w-36 pointer-events-none z-0">
            <svg viewBox="0 0 160 800" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
              {/* Layer 1: Back Cloud (Translucent soft blue) */}
              <path
                d="
                  M 160 0
                  L 108 0
                  C 70 26.25, 70 78.75, 93 105
                  C 55 133.75, 55 191.25, 86 220
                  C 45 251.25, 45 313.75, 80 345
                  C 35 377.5, 35 442.5, 86 475
                  C 42 506.25, 42 568.75, 93 600
                  C 52 628.75, 52 686.25, 106 715
                  C 72 736.25, 72 778.75, 106 800
                  L 160 800
                  Z
                "
                fill="rgba(255, 255, 255, 0.22)"
              />

              {/* Layer 2: Middle Cloud (Medium translucent) */}
              <path
                d="
                  M 160 0
                  L 124 0
                  C 90 26.25, 90 78.75, 109 105
                  C 75 133.75, 75 191.25, 102 220
                  C 65 251.25, 65 313.75, 96 345
                  C 55 377.5, 55 442.5, 102 475
                  C 62 506.25, 62 568.75, 109 600
                  C 72 628.75, 72 686.25, 122 715
                  C 92 736.25, 92 778.75, 122 800
                  L 160 800
                  Z
                "
                fill="rgba(255, 255, 255, 0.42)"
              />

              {/* Layer 3: Solid White Front Cloud (Merges into right side white background) */}
              <path
                d="
                  M 160 0
                  L 140 0
                  C 110 26.25, 110 78.75, 125 105
                  C 95 133.75, 95 191.25, 118 220
                  C 85 251.25, 85 313.75, 112 345
                  C 75 377.5, 75 442.5, 118 475
                  C 82 506.25, 82 568.75, 125 600
                  C 92 628.75, 92 686.25, 138 715
                  C 112 736.25, 112 778.75, 138 800
                  L 160 800
                  Z
                "
                fill="#ffffff"
              />
            </svg>
          </div>

          {/* Mobile Cloud Divider (Along the bottom edge of blue header) */}
          <div className="block lg:hidden absolute left-0 right-0 bottom-0 w-full h-12 sm:h-16 pointer-events-none z-0">
            <svg viewBox="0 0 800 160" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
              <path
                d="
                  M 0 160
                  L 0 108
                  C 26.25 70, 78.75 70, 105 93
                  C 133.75 55, 191.25 55, 220 86
                  C 251.25 45, 313.75 45, 345 80
                  C 377.5 35, 442.5 35, 475 86
                  C 506.25 42, 568.75 42, 600 93
                  C 628.75 52, 686.25 52, 715 106
                  C 736.25 72, 778.75 72, 800 106
                  L 800 160
                  Z
                "
                fill="rgba(255, 255, 255, 0.22)"
              />
              <path
                d="
                  M 0 160
                  L 0 124
                  C 26.25 90, 78.75 90, 105 109
                  C 133.75 75, 191.25 75, 220 102
                  C 251.25 65, 313.75 65, 345 96
                  C 377.5 55, 442.5 55, 475 102
                  C 506.25 62, 568.75 62, 600 109
                  C 628.75 72, 686.25 72, 715 122
                  C 736.25 92, 778.75 92, 800 122
                  L 800 160
                  Z
                "
                fill="rgba(255, 255, 255, 0.42)"
              />
              <path
                d="
                  M 0 160
                  L 0 140
                  C 26.25 110, 78.75 110, 105 125
                  C 133.75 95, 191.25 95, 220 118
                  C 251.25 85, 313.75 85, 345 112
                  C 377.5 75, 442.5 75, 475 118
                  C 506.25 82, 568.75 82, 600 125
                  C 628.75 92, 686.25 92, 715 138
                  C 736.25 112, 778.75 112, 800 138
                  L 800 160
                  Z
                "
                fill="#ffffff"
              />
            </svg>
          </div>

        </div>

        {/* Right Side: Clean White Login Form Panel */}
        <div className="w-full lg:w-[52%] xl:w-[54%] bg-white flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-8 sm:py-10 lg:py-14 z-10">
          
          {/* Heading */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
              Log in to your account
            </h2>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-3.5 sm:p-4 border border-red-200 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
            
            {/* E-mail Address / ID Field (Underline input style with checkmark) */}
            <div className="relative group">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-black mb-1.5"
              >
                E-mail Address
              </label>
              <div className="relative flex items-center border-b border-gray-300 focus-within:border-blue-600 transition-colors duration-200">
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 sm:py-2.5 pr-8 bg-transparent text-black placeholder-black text-sm focus:outline-none"
                />
                {/* Subtle right checkmark icon */}
                <div
                  className={`absolute right-1 transition-colors duration-200 ${
                    email.trim() ? 'text-blue-600' : 'text-sky-300 group-focus-within:text-blue-400'
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field (Underline input style with eye toggle & checkmark) */}
            <div className="relative group">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-black mb-1.5"
              >
                Password
              </label>
              <div className="relative flex items-center border-b border-gray-300 focus-within:border-blue-600 transition-colors duration-200">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2 sm:py-2.5 pr-14 bg-transparent text-black placeholder-black text-sm focus:outline-none"
                />
                <div className="absolute right-1 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="text-black hover:text-black transition-colors focus:outline-none p-0.5 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`transition-colors duration-200 ${
                      password.length > 0 ? 'text-blue-600' : 'text-sky-300 group-focus-within:text-blue-400'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Remember Me Checkbox and Forgot Password Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-0.5">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none text-black hover:text-black">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer ${
                    rememberMe ? 'bg-blue-600 text-white shadow-sm' : 'border border-gray-300 bg-white'
                  }`}
                  aria-checked={rememberMe}
                  role="checkbox"
                >
                  {rememberMe && (
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
                <span>Remember me on this device</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline text-xs text-left sm:text-right"
              >
                Forgot password?
              </Link>
            </div>

            {/* Buttons Row (Matching the 2 Pill Buttons from Mockup) */}
            <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4">
              {/* Primary Pill Button (Sign In) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-w-[135px] px-9 py-2.5 rounded-full bg-gradient-to-r from-[#1761de] to-[#2372f8] text-white font-medium text-sm shadow-[0_6px_20px_rgba(23,97,222,0.35)] hover:shadow-[0_8px_25px_rgba(23,97,222,0.45)] hover:from-[#1355c7] hover:to-[#1f68e3] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* Secondary Pill Button */}
              <Link
                href="/forgot-password"
                className="w-full sm:w-auto min-w-[135px] px-9 py-2.5 rounded-full border border-gray-300 text-black hover:text-black hover:border-gray-400 hover:bg-gray-50 text-sm font-medium transition-all text-center"
              >
                Forgot Password
              </Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
