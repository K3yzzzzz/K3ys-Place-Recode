import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export function LoginWall() {
    const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-1001 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" />

      <div
        className="
          relative z-10 text-center rounded-lg p-8 shadow-xl
          border border-gray-300
          bg-var(--color-navbar-panel)
          backdrop-blur-sm
        "
      >
        <motion.h1
          className="text-4xl mb-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Welcome to K3yz Place
        </motion.h1>

        <motion.p
          className="mb-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          Please log in or create a new account to continue.
        </motion.p>

        <motion.button
          className="btn blue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          onClick={() => navigate("/login")}
        >
          Log In / Sign Up
        </motion.button>
      </div>
    </div>
  );
}
