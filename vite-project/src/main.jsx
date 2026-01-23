import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import "./styles/index.css";

import { LoginWall } from "./components/LoginWall.jsx";
import { Navbar } from "./components/Navbar.jsx";

import { Home } from "./pages/Home.jsx";
import { Games } from "./pages/Games.jsx";
import { Apps } from "./pages/Apps.jsx";
import { Settings } from "./pages/Settings.jsx";
import { Login } from "./pages/Login.jsx";
import { Signup } from "./pages/Signup.jsx";

function Layout({ children, loggedIn }) {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";
  const hideLoginWall = location.pathname === "/login" || location.pathname ==="/signup" || loggedIn;

  return (
    <>
      {!hideLoginWall && <LoginWall />}
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Layout loggedIn={loggedIn}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/games" element={<Games />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/settings" element={<Settings setLoggedIn={setLoggedIn} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

// ---------- Render ----------
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);