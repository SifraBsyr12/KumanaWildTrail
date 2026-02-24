import { useState } from "react";
import { ChartNoAxesColumnDecreasing, X } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export default function   AuthModal({
  onClose,
  isLogin,
  switchToLogin,
  switchToSignup,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
  
      await fetch(`${BASE_URL}/api/auth/firebase/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Auth-Type": "Firebase"
        },
      });
      localStorage.setItem("user", JSON.stringify({
        email: user.email,
        name: user.displayName,
        role: "CUSTOMER",
      }));
  
      navigate(`/Customerdashboard`);
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google Login failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!isLogin) {
      // Customer sign-up (only handled via Firebase)
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        await fetch(`${BASE_URL}/api/auth/firebase/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Auth-Type": "Firebase"
          },
        });
  
        localStorage.setItem("user", JSON.stringify({
          email: userCredential.user.email,
          name: name,
          role: "CUSTOMER",
        }));
  
        window.location.href = "/CustomerDashboard";
      } catch (err) {
        toast.error("Sign-up failed: " + err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      // LOGIN flow: lookup and route accordingly
      try {
        const res = await fetch(`${BASE_URL}/api/auth/lookup?email=${email}`);
        if (!res.ok) throw new Error("User not found.");
        const { role } = await res.json();
       
        if (role === "CUSTOMER") {
          // Firebase Login
          await signInWithEmailAndPassword(auth, email, password);
          const token = await auth.currentUser.getIdToken();
  
          await fetch(`${BASE_URL}/api/auth/firebase/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
  
          localStorage.setItem("user", JSON.stringify({
            email: email,
            name: auth.currentUser.displayName || name,
            role: "CUSTOMER",
          }));
  
          window.location.href = "/CustomerDashboard";
        } else {
          // Admin / Driver login (Spring Boot)
          const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
  
          if (!loginRes.ok) throw new Error("Incorrect credentials.");
          const data = await loginRes.json();
  
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));
          const decoded = jwtDecode(data.token);
  
          if (decoded.role === "ADMIN") navigate("/AdminDashboard");
          else if (decoded.role === "DRIVER") navigate("/DriverDashboard");
        }
      } catch (err) {
        toast.error("Login failed: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-[#0e171b] mb-6">
            {isLogin ? "Login to Wild Trails" : "Create an Account"}
          </h2>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-xl">
              <div className="w-12 h-12 border-4 border-[#47b4ea] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 rounded-xl bg-[#e7eff3] px-4 text-[#0e171b] placeholder-[#4e7f97] focus:outline-none"
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-xl bg-[#e7eff3] px-4 text-[#0e171b] placeholder-[#4e7f97] focus:outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-xl bg-[#e7eff3] px-4 text-[#0e171b] placeholder-[#4e7f97] focus:outline-none"
              required
              minLength="6"
            />

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#47b4ea] text-sm font-bold text-[#0e171b] tracking-wide hover:bg-[#3ca1d3] transition-colors"
              disabled={isLoading}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-[#4e7f97] mt-4">
            Or continue with
          </p>

          <div className="flex flex-col gap-3 mt-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 h-12 rounded-xl bg-[#e7eff3] text-[#0e171b] font-medium text-sm hover:bg-[#d9e4ea] transition-colors"
              disabled={isLoading}
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-3 h-12 rounded-xl bg-[#e7eff3] text-[#0e171b] font-medium text-sm hover:bg-[#d9e4ea] transition-colors"
              disabled={isLoading}
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="text-blue-600"
                viewBox="0 24 24"
              >
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37c-.82.48-1.72.82-2.67 1a4.27 4.27 0 00-7.27 3.9A12.1 12.1 0 013 4.69a4.27 4.27 0 001.32 5.7A4.2 4.2 0 012.8 9v.05a4.27 4.27 0 003.43 4.18c-.7.2-1.43.23-2.15.08a4.28 4.28 0 004 2.98A8.57 8.57 0 012 19.54a12.07 12.07 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.77 8.77 0 0024 5.5a8.5 8.5 0 01-2.54.7z" />
              </svg>
              Continue with Twitter
            </button>
          </div>

          <p className="text-center text-sm text-[#4e7f97] mt-6">
            {isLogin ? (
              <span>
                Don't have an account?{" "}
                <button
                  onClick={switchToSignup}
                  className="underline hover:text-[#0e171b] transition-colors"
                  disabled={isLoading}
                >
                  Register
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  onClick={switchToLogin}
                  className="underline hover:text-[#0e171b] transition-colors"
                  disabled={isLoading}
                >
                  Login
                </button>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}