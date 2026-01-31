import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login({ setLoggedIn }) {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const secret = import.meta.env.VITE_CODE;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (code.trim() !== secret) return;

    setLoggedIn(true);
    navigate("/");
  };

  const validInput = code.trim() !== "";

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
          Login
        </motion.h1>

        <motion.p
          className="mb-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Please enter the code to log in.
        </motion.p>

        <form onSubmit={handleSubmit} className="w-80 mx-auto">
          <motion.input
            type="text"
            placeholder="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mb-6 p-2 border border-gray-300 rounded w-full"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          <motion.button
            type="submit"
            disabled={!validInput}
            className={`btn ${validInput ? "blue" : "disabled cursor-not-allowed"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Log In
          </motion.button>
        </form>
      </div>
    </div>
  );
}
