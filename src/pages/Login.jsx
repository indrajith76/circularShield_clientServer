
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";

import logo from "../assets/c_logo1.png";


export const Login = () => {

  const navigate = useNavigate();

  const {
    signIn,
    resetPassword,
    refreshUserProfile,
    registerUserProfile,
    logOut,
  } = useAuth();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Login handler
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    let signedIn = false;

    try {

      // Step 1: Firebase authentication
      const result = await signIn(
        email.trim(),
        password
      );

      signedIn = true;

      const firebaseUser = result.user;

      let userProfile;


      // Step 2: Get MongoDB user profile
      try {

        userProfile = await refreshUserProfile(
          firebaseUser
        );

      } catch (profileError) {

        // Recover an incomplete registration
        if (profileError.status === 404) {

          userProfile = await registerUserProfile(
            firebaseUser,
            firebaseUser.displayName ||
              firebaseUser.email.split("@")[0]
          );

        } else {

          throw profileError;

        }
      }


      // Step 3: Role-based redirection
      if (userProfile.role === "admin") {

        navigate("/admin/dashboard", {
          replace: true,
        });

      } else if (userProfile.role === "user") {

        navigate("/dashboard", {
          replace: true,
        });

      } else {

        throw new Error("Invalid account role.");

      }

    } catch (err) {

      if (signedIn) {
        await logOut().catch(() => {});
      }

      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {

        setError("Invalid email or password.");

      } else if (err.code === "auth/invalid-email") {

        setError("Please enter a valid email.");

      } else if (err.code === "auth/too-many-requests") {

        setError("Too many attempts. Please try again later.");

      } else if (err.code === "auth/network-request-failed") {

        setError("Network error. Please try again.");

      } else {

        setError(err.message || "Login failed.");

      }

    } finally {

      setSubmitting(false);

    }
  };


  // Forgot password handler
  const handleForgotPassword = async () => {

    setError("");
    setSuccess("");

    if (!email.trim()) {

      setError("Please enter your email address first.");

      return;
    }

    setResetting(true);

    try {

      await resetPassword(email.trim());

      setSuccess(
        "If an account exists for this email, a password reset link will be sent."
      );

    } catch (err) {

      if (err.code === "auth/user-not-found") {

        setSuccess(
          "If an account exists for this email, a password reset link will be sent."
        );

      } else {

        setError(
          "Unable to send password reset email. Please try again."
        );

      }

    } finally {

      setResetting(false);

    }
  };


  return (

    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 sm:p-8">

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Left Branding Column */}

        <div className="text-white space-y-4 px-4 sm:px-6">

          <Link to="/dashboard" className="inline-block">

            <img
              src={logo}
              alt="CircularShield"
              className="h-24 sm:h-28 w-auto max-w-[260px] object-contain drop-shadow-lg shrink-0"
            />

            <h1 className="sr-only">
              CircularShield
            </h1>

          </Link>

          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-sm">

            Verify a job circular before you apply.
            চাকরির বিজ্ঞপ্তি যাচাই করুন, প্রতারণা এড়ান।

          </p>

        </div>


        {/* Right Auth Card */}

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">

          {/* Mode Switcher */}

          <div className="flex items-center gap-2 mb-6 p-1 bg-[#F1F5F9] rounded-xl w-fit">

            <button
              type="button"
              className="px-5 py-2 rounded-lg text-xs font-bold bg-[#0F172A] text-white shadow-xs cursor-default"
            >
              Login
            </button>

            <Link
              to="/register"
              className="px-5 py-2 rounded-lg text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Register
            </Link>

          </div>


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Email */}

            <div>

              <label className="block text-xs font-semibold text-[#182B36] mb-1.5">
                Email
              </label>

              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                disabled={submitting || resetting}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] transition-colors"
              />

            </div>


            {/* Password */}

            <div>

              <label className="block text-xs font-semibold text-[#182B36] mb-1.5">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  disabled={submitting || resetting}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 pr-16 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] transition-colors"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-[#182B36]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Forgot Password */}

            <div className="flex justify-end">

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={submitting || resetting}
                className="text-xs text-[#64748B] hover:text-[#087F70] font-medium transition-colors disabled:opacity-50"
              >

                {resetting
                  ? "Sending..."
                  : "Forgot password?"}

              </button>

            </div>


            {/* Error Message */}

            {error && (

              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl p-3"
              >
                {error}
              </div>

            )}


            {/* Success Message */}

            {success && (

              <div
                role="status"
                className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl p-3"
              >
                {success}
              </div>

            )}


            {/* Login Button */}

            <button
              type="submit"
              disabled={submitting || resetting}
              className="w-full py-3 px-4 rounded-xl bg-[#087F70] text-white text-sm font-semibold hover:bg-[#066559] transition-colors shadow-xs cursor-pointer text-center disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {submitting ? (

                <span className="flex items-center justify-center gap-2">

                  <span className="loading loading-spinner loading-xs"></span>

                  Logging in...

                </span>

              ) : (

                "Login"

              )}

            </button>


            <div className="text-center pt-2">

              <Link
                to="/register"
                className="text-xs text-[#64748B] hover:text-[#0F172A] font-medium"
              >
                New here? Create an account
              </Link>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;
