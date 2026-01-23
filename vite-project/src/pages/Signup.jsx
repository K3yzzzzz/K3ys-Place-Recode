import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Signup failed");
        return;
      }

      // Success: redirect to login
      navigate("/login");
    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="
            relative z-10 text-center rounded-lg p-8 shadow-xl
            border border-gray-300
            bg-var(--color-navbar-panel)
          "
      >
        <motion.h1
          className="text-4xl mb-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Sign Up
        </motion.h1>

        <motion.p
          className="mb-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Please enter your credentials to register.
        </motion.p>
        <form onSubmit={handleSubmit} className="w-80 mx-auto">
          <motion.input
            type="email"
            placeholder="Email"
            className="mb-4 p-2 border border-gray-300 rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          <motion.input
            type="password"
            placeholder="Password"
            className="mb-6 p-2 border border-gray-300 rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <motion.button 
            type="submit"
            disabled={!isFormValid}
            className={`${ isFormValid ? "btn blue" : "btn disabled cursor-not-allowed"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Sign up
          </motion.button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?
          <a
            className="text-blue-600 underline"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
